/**
 * CampusConnect AI - Chatbot Service
 * 
 * Modular architecture:
 * 1. Intent Classification & Entity Extraction
 * 2. MongoDB Knowledge Base Querying
 * 3. Dynamic Response Generation with Structured Metadata & Follow-ups
 * 4. Extensible LLM Interface (Gemini / OpenAI ready)
 */

const Department = require('../models/Department');
const Cutoff = require('../models/Cutoff');
const FeeStructure = require('../models/FeeStructure');
const Hostel = require('../models/Hostel');
const Transport = require('../models/Transport');
const Placement = require('../models/Placement');
const Admission = require('../models/Admission');
const College = require('../models/College');

class ChatbotService {
  /**
   * Main entry point to process student/parent queries
   */
  async processQuery(question, context = {}) {
    const cleanQuery = question.toLowerCase().trim();

    // 1. Identify Intent
    const intent = this.detectIntent(cleanQuery);

    // 2. Fetch ground-truth data from MongoDB based on intent
    const responseData = await this.resolveIntentData(intent, cleanQuery, context);

    // 3. Optional: If external LLM API key exists, could augment response here
    // e.g. if (process.env.GEMINI_API_KEY) { return await this.callLLM(cleanQuery, responseData); }

    return {
      success: true,
      query: question,
      intent: intent.name,
      answer: responseData.answer,
      metadata: responseData.metadata || null,
      suggestedFollowUps: responseData.suggestedFollowUps || this.getDefaultSuggestions()
    };
  }

  /**
   * Rule and Keyword-based Intent Classification
   */
  detectIntent(text) {
    if (/cutoff|cut-off|closing rank|opening rank|can i get|rank|percentile|mark/i.test(text)) {
      return { name: 'CUTOFF_INQUIRY' };
    }
    if (/fee|fees|cost|tuition|expense|affordable|scholarship|payment/i.test(text)) {
      return { name: 'FEES_INQUIRY' };
    }
    if (/hostel|room|mess|food|stay|accommodation|warden|curfew|boys hostel|girls hostel/i.test(text)) {
      return { name: 'HOSTEL_INQUIRY' };
    }
    if (/bus|transport|route|stop|pickup|travel|commuting|vehicle/i.test(text)) {
      return { name: 'TRANSPORT_INQUIRY' };
    }
    if (/placement|package|lpa|recruiter|company|companies|highest salary|average salary|hired|job/i.test(text)) {
      return { name: 'PLACEMENT_INQUIRY' };
    }
    if (/admission|apply|counselling|document|certificate|deadline|date|eligibility|how to join/i.test(text)) {
      return { name: 'ADMISSION_INQUIRY' };
    }
    if (/department|course|branch|curriculum|cse|it|ece|eee|mech|civil|ai|data science|degree/i.test(text)) {
      return { name: 'DEPARTMENT_INQUIRY' };
    }
    if (/college|about|ranking|naac|nirf|accreditation|campus|facility|location|where is/i.test(text)) {
      return { name: 'COLLEGE_INQUIRY' };
    }
    return { name: 'GENERAL_GREETING' };
  }

  /**
   * Search MongoDB and craft rich, factual responses
   */
  async resolveIntentData(intent, query, context) {
    switch (intent.name) {
      case 'CUTOFF_INQUIRY':
        return await this.handleCutoffQuery(query);

      case 'FEES_INQUIRY':
        return await this.handleFeesQuery(query);

      case 'HOSTEL_INQUIRY':
        return await this.handleHostelQuery(query);

      case 'TRANSPORT_INQUIRY':
        return await this.handleTransportQuery(query);

      case 'PLACEMENT_INQUIRY':
        return await this.handlePlacementQuery(query);

      case 'ADMISSION_INQUIRY':
        return await this.handleAdmissionQuery(query);

      case 'DEPARTMENT_INQUIRY':
        return await this.handleDepartmentQuery(query);

      case 'COLLEGE_INQUIRY':
        return await this.handleCollegeQuery(query);

      default:
        return this.handleGeneralGreeting();
    }
  }

  async handleCutoffQuery(query) {
    const depts = await Department.find();
    let matchedDept = depts.find(d => 
      query.includes(d.departmentCode.toLowerCase()) || 
      query.includes(d.departmentName.toLowerCase())
    );

    // If specific department not found, default to popular CSE or general cutoff range
    const deptId = matchedDept ? matchedDept._id : (depts[0] ? depts[0]._id : null);
    const cutoffs = deptId 
      ? await Cutoff.find({ departmentId: deptId }).populate('departmentId').sort({ academicYear: -1, closingRank: 1 })
      : await Cutoff.find().populate('departmentId').sort({ academicYear: -1, closingRank: 1 }).limit(6);

    if (cutoffs.length === 0) {
      return {
        answer: 'Cutoff data is currently being updated for the latest academic cycle. In previous sessions, top engineering programs usually closed between 188.5 and 197.0 aggregate score.',
        suggestedFollowUps: ['What is the cutoff for CSE?', 'Compare CSE vs IT cutoffs', 'Show 2025 cutoff trends']
      };
    }

    const deptName = matchedDept ? matchedDept.departmentName : 'our top programs';
    const lines = cutoffs.slice(0, 4).map(c => 
      `• **${c.academicYear} (${c.category} - ${c.quota})**: Closing Cutoff: **${c.closingCutoff}/200**, Closing Rank: **#${c.closingRank}**`
    ).join('\n');

    return {
      answer: `Here are the latest official cutoff records for **${deptName}**:\n\n${lines}\n\n*Note: Use our "Can I Get This Department?" Cutoff Prediction tool on the Cutoffs page for automated rank evaluation!*`,
      metadata: { department: matchedDept ? matchedDept.departmentName : null, count: cutoffs.length },
      suggestedFollowUps: [
        `What are the fees for ${matchedDept ? matchedDept.departmentCode : 'CSE'}?`,
        'Can I get this department with rank 4500?',
        'What companies recruit from this department?'
      ]
    };
  }

  async handleFeesQuery(query) {
    const fees = await FeeStructure.find().populate('departmentId');
    if (!fees.length) {
      return {
        answer: 'Annual tuition fees generally range between ₹85,000 and ₹1,50,000 depending on department and quota. Hostel fees are approximately ₹85,000 per year including mess.',
        suggestedFollowUps: ['Show hostel fee breakdown', 'What is the bus transport fee?', 'Is scholarship available?']
      };
    }

    let targetFee = fees[0];
    for (const f of fees) {
      if (f.departmentId && (query.includes(f.departmentId.departmentCode.toLowerCase()) || query.includes(f.departmentId.departmentName.toLowerCase()))) {
        targetFee = f;
        break;
      }
    }

    return {
      answer: `Fee structure breakdown for **${targetFee.departmentId ? targetFee.departmentId.departmentName : 'Engineering'}** (Academic Year ${targetFee.academicYear}):\n\n` +
        `• **Tuition Fee:** ₹${targetFee.tuitionFee.toLocaleString('en-IN')}/year\n` +
        `• **Examination & Tech Fee:** ₹${targetFee.examinationFee.toLocaleString('en-IN')}/year\n` +
        `• **Other Amenities & Lab Fee:** ₹${targetFee.otherFees.toLocaleString('en-IN')}/year\n` +
        `• **Total Annual Academic Fee:** **₹${targetFee.totalAnnualFee.toLocaleString('en-IN')}**\n\n` +
        `*Optional add-ons: Hostel (~₹${targetFee.hostelFee.toLocaleString('en-IN')}) & Transport (~₹${targetFee.transportFee.toLocaleString('en-IN')}). Scholarships up to 50% are available for meritorious students.*`,
      metadata: { annualFee: targetFee.totalAnnualFee },
      suggestedFollowUps: [
        'Calculate my 4-year total education cost',
        'What are the hostel room types and fees?',
        'Does the college offer merit scholarships?'
      ]
    };
  }

  async handleHostelQuery(query) {
    const hostels = await Hostel.find();
    if (!hostels.length) {
      return {
        answer: 'CampusConnect provides state-of-the-art separate on-campus hostels for Boys and Girls with 24/7 high-speed Wi-Fi, air-conditioned rooms, hygienic dining mess, gym, and 24/7 CCTV security.',
        suggestedFollowUps: ['What are the hostel mess timings?', 'Hostel fee structure', 'What are hostel curfew rules?']
      };
    }

    const type = query.includes('girl') ? 'Girls' : (query.includes('boy') ? 'Boys' : null);
    const selected = type ? hostels.find(h => h.type === type) || hostels[0] : hostels[0];

    const roomDetails = selected.roomTypes.map(r => `• ${r.typeName}: ₹${r.fee.toLocaleString('en-IN')} / year`).join('\n');

    return {
      answer: `### 🏢 **${selected.hostelName} (${selected.type})**\n\n` +
        `• **Capacity & Availability:** ${selected.capacity} residents (${selected.availableBeds} beds currently vacant)\n` +
        `• **Base Annual Fee:** ₹${selected.fees.toLocaleString('en-IN')}\n\n` +
        `**Room Options:**\n${roomDetails}\n\n` +
        `**Mess & Food:** ${selected.messDetails.messType}. Timings: ${selected.messDetails.timings}.\n` +
        `**Amenities:** ${selected.facilities.slice(0, 6).join(', ')}.\n` +
        `**Warden Contact:** ${selected.contact.wardenName} (${selected.contact.phone})`,
      metadata: { hostelName: selected.hostelName },
      suggestedFollowUps: [
        'What are the hostel rules and gate timings?',
        'What bus routes are available if I do not stay in hostel?',
        'How do I apply for hostel booking?'
      ]
    };
  }

  async handleTransportQuery(query) {
    const routes = await Transport.find().limit(5);
    if (!routes.length) {
      return {
        answer: 'We operate over 25+ air-conditioned and deluxe bus routes covering all major transit points across the city and suburbs, running 5 days a week.',
        suggestedFollowUps: ['Show bus routes list', 'What is the transport fee?']
      };
    }

    const routeSummary = routes.map(r => 
      `• **Route ${r.routeNumber} (${r.startingPoint} ➔ Campus)**: Starts at ${r.stops[0] ? r.stops[0].time : '6:45 AM'}, Stops: ${r.stops.length}, Annual Fee: ₹${r.fee.toLocaleString('en-IN')}`
    ).join('\n');

    return {
      answer: `🚌 **College Bus & Transport Network:**\n\n` +
        `We have comprehensive bus connectivity with GPS live-tracking. Here are key routes:\n\n${routeSummary}\n\n` +
        `All routes feature experienced drivers, speed governors, and female student security protocols. You can view the visual stop timeline on the Transport module!`,
      metadata: { totalRoutes: routes.length },
      suggestedFollowUps: [
        'What is Route 1 stops list?',
        'What is the annual bus fee?',
        'What is the contact number for transport coordinator?'
      ]
    };
  }

  async handlePlacementQuery(query) {
    const companies = await Placement.find().sort({ hiringYear: -1 });
    const totalCount = companies.length;
    const topPackages = companies.slice(0, 5).map(c => 
      `• **${c.companyName}** (${c.industry}): **${c.package}** - Role: *${c.jobRole}*`
    ).join('\n');

    return {
      answer: `💼 **Placement & Career Overview:**\n\n` +
        `Over 120+ top-tier product and consulting corporations visit CampusConnect annually with an average package of **8.5 LPA** and highest package reaching **44 LPA**.\n\n` +
        `**Recent Top Recruiters:**\n${topPackages}\n\n` +
        `Our dedicated Placement Cell conducts pre-placement training starting from the 3rd year including DSA, System Design, and Soft Skills.`,
      metadata: { companiesCount: totalCount },
      suggestedFollowUps: [
        'Which companies recruit for CSE and IT?',
        'What is the highest package this year?',
        'What is the training process for campus placements?'
      ]
    };
  }

  async handleAdmissionQuery(query) {
    const admission = await Admission.findOne({ admissionYear: 2026 }) || await Admission.findOne();
    if (!admission) {
      return {
        answer: 'Admissions for 2026 are open. Eligibility requires 10+2 with Physics, Chemistry and Mathematics. Admission is conducted via Single Window State Counselling and Management Quota.',
        suggestedFollowUps: ['What documents are required for admission?', 'What are the important admission dates?']
      };
    }

    const docList = admission.requiredDocuments.slice(0, 5).map(d => `• ${d.name} (${d.mandatory ? 'Mandatory' : 'Optional'})`).join('\n');
    const dates = admission.importantDates.slice(0, 3).map(d => `• ${d.event}: **${d.date}** [${d.status}]`).join('\n');

    return {
      answer: `🎓 **Admission Guidance 2026:**\n\n` +
        `**Eligibility Criteria:** ${admission.eligibility}\n\n` +
        `**Key Upcoming Dates:**\n${dates}\n\n` +
        `**Essential Documents Required:**\n${docList}\n\n` +
        `*Admissions Helpline: ${admission.helpline.phone} | ${admission.helpline.email}*`,
      metadata: { year: admission.admissionYear },
      suggestedFollowUps: [
        'Check my admission readiness checklist',
        'What is the counselling process step-by-step?',
        'What are the cutoffs for engineering departments?'
      ]
    };
  }

  async handleDepartmentQuery(query) {
    const depts = await Department.find();
    let specific = depts.find(d => 
      query.includes(d.departmentCode.toLowerCase()) || 
      query.includes(d.departmentName.toLowerCase())
    );

    if (specific) {
      return {
        answer: `🏛️ **Department of ${specific.departmentName} (${specific.departmentCode})**\n\n` +
          `• **Degree & Duration:** ${specific.degree} (${specific.duration})\n` +
          `• **Annual Intake:** ${specific.intake} seats\n` +
          `• **Eligibility:** ${specific.eligibility}\n` +
          `• **Key Facilities & Labs:** ${specific.facilities.slice(0, 4).join(', ')}\n` +
          `• **Career Outcomes:** ${specific.careerOptions.slice(0, 4).join(', ')}\n\n` +
          `Head of Department: ${specific.hod.name} (${specific.hod.qualification})`,
        metadata: { departmentCode: specific.departmentCode },
        suggestedFollowUps: [
          `What is the cutoff for ${specific.departmentCode}?`,
          `What is the fee structure for ${specific.departmentCode}?`,
          `Compare ${specific.departmentCode} with IT`
        ]
      };
    }

    const deptList = depts.map(d => `• **${d.departmentName}** (${d.departmentCode}) - ${d.intake} Seats`).join('\n');
    return {
      answer: `🏛️ **Academic Departments Offered at CampusConnect:**\n\n${deptList}\n\n*Click on any department in the Departments tab to explore labs, faculty, syllabus, and placement statistics.*`,
      metadata: { totalDepartments: depts.length },
      suggestedFollowUps: [
        'Tell me about Computer Science & Engineering',
        'Tell me about Artificial Intelligence & Data Science',
        'Compare CSE vs AI&DS'
      ]
    };
  }

  async handleCollegeQuery(query) {
    const college = await College.findOne();
    const collegeName = college ? college.name : 'CampusConnect Institute of Technology';
    const acc = college ? college.accreditation : 'NAAC A++, NBA Accredited, AICTE Approved';
    const loc = college ? college.location : 'Campus Boulevard, Knowledge City';

    return {
      answer: `🏫 **About ${collegeName}**\n\n` +
        `Established with a vision for world-class technical education, **${collegeName}** is recognized for academic excellence, state-of-the-art research laboratories, and industry immersion.\n\n` +
        `• **Accreditation:** ${acc}\n` +
        `• **Rankings:** NIRF Ranked among Top 50 Engineering Institutions in India\n` +
        `• **Location:** ${loc}\n` +
        `• **Campus Infrastructure:** 65-Acre Smart Green Campus with 100Gbps internet, Innovation Incubator, Central AC Digital Library, and Olympic-standard sports arena.\n\n` +
        `*Phone: ${college ? college.contact.phone : '+91 44 2855 0100'} | Email: ${college ? college.contact.email : 'info@campusconnect.edu'}*`,
      metadata: { collegeName },
      suggestedFollowUps: [
        'What departments are available?',
        'What is the highest placement package?',
        'What are the hostel and transport options?'
      ]
    };
  }

  handleGeneralGreeting() {
    return {
      answer: `👋 **Hello and welcome to CampusConnect AI!**\n\nI am your 24/7 intelligent college guidance assistant. I can help you with:\n\n` +
        `• **Cutoffs & Admission Guidance** ("What is the cutoff for CSE?")\n` +
        `• **Fee Structures & Scholarships** ("What are the B.Tech tuition fees?")\n` +
        `• **Hostel Accommodation & Mess** ("Tell me about boys hostel facilities")\n` +
        `• **Transport & Bus Routes** ("Show bus routes and stops")\n` +
        `• **Placement Records & Companies** ("What companies visit for placements?")\n` +
        `• **Eligibility & Documents** ("What certificates are required for counselling?")\n\n` +
        `How may I assist you today?`,
      suggestedFollowUps: [
        'What is the cutoff for CSE?',
        'What are the hostel fees?',
        'What companies visit the college?',
        'What bus facilities are available?'
      ]
    };
  }

  getDefaultSuggestions() {
    return [
      'What is the cutoff for CSE?',
      'What are the hostel fees?',
      'What companies visit the college?',
      'What bus facilities are available?'
    ];
  }
}

module.exports = new ChatbotService();
