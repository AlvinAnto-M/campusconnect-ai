const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const College = require('../models/College');
const Department = require('../models/Department');
const Cutoff = require('../models/Cutoff');
const FeeStructure = require('../models/FeeStructure');
const Hostel = require('../models/Hostel');
const Transport = require('../models/Transport');
const Placement = require('../models/Placement');
const Admission = require('../models/Admission');
const ChatHistory = require('../models/ChatHistory');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect_db';
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await College.deleteMany({});
    await Department.deleteMany({});
    await Cutoff.deleteMany({});
    await FeeStructure.deleteMany({});
    await Hostel.deleteMany({});
    await Transport.deleteMany({});
    await Placement.deleteMany({});
    await Admission.deleteMany({});
    await ChatHistory.deleteMany({});

    console.log('[Seed]: Cleared existing database records.');

    // 1. Seed College
    const college = await College.create({
      name: 'CampusConnect Institute of Science & Technology',
      code: 'CCIST-2026',
      tagline: 'Empowering Minds, Innovating Futures, Transforming Society',
      description: 'CampusConnect Institute of Science & Technology is a premier autonomous institution renowned for cutting-edge engineering curriculum, research-first ethos, world-class industry alliances, and 100% placement track record.',
      location: 'Knowledge Boulevard, Cyber Tech Park, Chennai, Tamil Nadu - 600025',
      establishedYear: 2001,
      accreditation: 'NAAC A++ Grade (CGPA 3.78/4.0), NBA Tier-1 Accredited, AICTE Approved, Autonomous',
      ranking: 'NIRF All-India Engineering Rank #42 | Outlook Survey #12 Private Tech Institute',
      website: 'https://campusconnect.edu',
      contact: {
        email: 'admissions@campusconnect.edu',
        phone: '+91 44 2855 0100 / +91 44 2855 0101',
        address: 'Knowledge Boulevard, Cyber Tech Park, Chennai - 600025'
      },
      facilities: [
        'High-Performance NVIDIA AI Computing Cluster',
        '65-Acre Smart Eco-Campus with 100% Solar Power',
        'State-of-the-art Central AC Digital Library',
        'Innovation & Incubation Hub with ₹2 Cr Seed Grants',
        'Olympic Standard Track and Indoor Sports Complex',
        'Full Wi-Fi 6 Enabled Campus with 10 Gbps Backbone'
      ],
      campusHighlights: [
        { title: 'Academic Departments', count: '8', icon: 'fa-building-columns' },
        { title: 'Placement Percentage', count: '96.4%', icon: 'fa-chart-line' },
        { title: 'Highest Package', count: '44 LPA', icon: 'fa-trophy' },
        { title: 'Industry Partners', count: '150+', icon: 'fa-handshake' }
      ]
    });

    // 2. Seed Departments
    const deptData = [
      {
        departmentName: 'Computer Science & Engineering',
        departmentCode: 'CSE',
        description: 'Specializes in algorithms, software engineering, cloud architecture, and intelligent systems with state-of-the-art computing laboratories.',
        degree: 'B.Tech / B.E.',
        duration: '4 Years',
        intake: 180,
        eligibility: 'Passed 10+2 with Physics, Mathematics & Chemistry (Min 60% aggregate)',
        facilities: ['NVIDIA GPU Computing Lab', 'Cloud & Virtualization Lab', 'Cybersecurity Sandbox', 'Software Innovation Studio'],
        careerOptions: ['Full Stack Developer', 'Cloud Architect', 'Cybersecurity Engineer', 'Data Scientist', 'Systems Engineer'],
        hod: { name: 'Dr. R. Sundaram, Ph.D.', email: 'hod.cse@campusconnect.edu', qualification: 'Ph.D. (IIT Madras), Post-Doc (NUS)' },
        labs: ['Advanced Programming Lab', 'Open Source Dev Lab', 'Distributed Systems Lab'],
        icon: 'fa-laptop-code',
        color: '#2563eb',
        featured: true
      },
      {
        departmentName: 'Artificial Intelligence & Data Science',
        departmentCode: 'AI&DS',
        description: 'Pioneering multidisciplinary program integrating machine learning, deep learning, NLP, computer vision, and big data engineering.',
        degree: 'B.Tech',
        duration: '4 Years',
        intake: 120,
        eligibility: 'Passed 10+2 with Mathematics, Physics & Chemistry/CS (Min 60% aggregate)',
        facilities: ['Supercomputing Neural Center', 'Big Data Hadoop Cluster', 'Computer Vision Studio', 'Robotics & AI Sandbox'],
        careerOptions: ['Machine Learning Engineer', 'Data Scientist', 'AI Research Scientist', 'NLP Specialist', 'BI Analytics Consultant'],
        hod: { name: 'Dr. Ananya Roy, Ph.D.', email: 'hod.aids@campusconnect.edu', qualification: 'Ph.D. (IISc Bangalore)' },
        labs: ['Deep Learning Lab', 'Predictive Modeling Studio', 'Autonomous Systems Lab'],
        icon: 'fa-brain',
        color: '#7c3aed',
        featured: true
      },
      {
        departmentName: 'Information Technology',
        departmentCode: 'IT',
        description: 'Focuses on enterprise application development, web technologies, database design, DevOps, and information security management.',
        degree: 'B.Tech',
        duration: '4 Years',
        intake: 120,
        eligibility: 'Passed 10+2 with Physics, Chemistry & Mathematics (Min 60% aggregate)',
        facilities: ['Full-Stack Web Dev Lab', 'DevOps & CI/CD Sandbox', 'Database Engineering Hub', 'Mobile App Center'],
        careerOptions: ['Full Stack Developer', 'DevOps Engineer', 'Database Administrator', 'Solutions Architect', 'UI/UX Engineer'],
        hod: { name: 'Dr. M. Karthik, Ph.D.', email: 'hod.it@campusconnect.edu', qualification: 'Ph.D. (Anna University)' },
        labs: ['Web Technologies Lab', 'Cloud Infrastructure Lab', 'Mobile Applications Lab'],
        icon: 'fa-network-wired',
        color: '#0891b2',
        featured: true
      },
      {
        departmentName: 'Electronics & Communication Engineering',
        departmentCode: 'ECE',
        description: 'Comprehensive program covering VLSI design, embedded systems, 5G wireless networks, IoT devices, and signal processing.',
        degree: 'B.E.',
        duration: '4 Years',
        intake: 180,
        eligibility: 'Passed 10+2 with Physics, Mathematics & Chemistry (Min 60% aggregate)',
        facilities: ['Cadence & Synopsys VLSI Lab', 'Texas Instruments Embedded Systems Lab', 'RF & Microwave Anechoic Chamber', 'IoT Prototyping Center'],
        careerOptions: ['VLSI Design Engineer', 'Embedded Firmware Engineer', '5G Telecom Specialist', 'Hardware Design Engineer', 'Robotics Engineer'],
        hod: { name: 'Dr. S. Radhakrishnan, Ph.D.', email: 'hod.ece@campusconnect.edu', qualification: 'Ph.D. (IIT Delhi)' },
        labs: ['Digital Signal Processing Lab', 'Microprocessor & Microcontroller Lab', 'Wireless Comm Lab'],
        icon: 'fa-microchip',
        color: '#059669',
        featured: true
      },
      {
        departmentName: 'Electrical & Electronics Engineering',
        departmentCode: 'EEE',
        description: 'Drives the clean-energy transition through electric vehicles (EV), renewable energy grids, smart power systems, and power electronics.',
        degree: 'B.E.',
        duration: '4 Years',
        intake: 60,
        eligibility: 'Passed 10+2 with Physics, Mathematics & Chemistry (Min 60% aggregate)',
        facilities: ['Electric Vehicle (EV) Powertrain Lab', 'Smart Grid & Renewable Energy Center', 'Power Electronics Simulator', 'High Voltage Lab'],
        careerOptions: ['EV System Architect', 'Power Systems Engineer', 'Control & Automation Engineer', 'Renewable Energy Analyst'],
        hod: { name: 'Dr. V. Lakshmi, Ph.D.', email: 'hod.eee@campusconnect.edu', qualification: 'Ph.D. (NIT Trichy)' },
        labs: ['Electric Machines Lab', 'Power Systems Simulation Lab', 'Industrial Automation Lab'],
        icon: 'fa-bolt',
        color: '#d97706',
        featured: false
      },
      {
        departmentName: 'Mechanical Engineering',
        departmentCode: 'MECH',
        description: 'Blends classical thermo-mechanical principles with smart manufacturing, 3D printing, CAD/CAM/CAE simulations, and autonomous robotics.',
        degree: 'B.E.',
        duration: '4 Years',
        intake: 120,
        eligibility: 'Passed 10+2 with Physics, Chemistry & Mathematics (Min 55% aggregate)',
        facilities: ['Advanced CNC Machining Center', 'Additive Manufacturing 3D Lab', 'Automotive Testing Dyno Lab', 'Fluid Dynamics Wind Tunnel'],
        careerOptions: ['Design Engineer (CAD/CAE)', 'Automotive Systems Engineer', 'Robotics & Automation Specialist', 'Thermal Plant Engineer'],
        hod: { name: 'Dr. P. Murugan, Ph.D.', email: 'hod.mech@campusconnect.edu', qualification: 'Ph.D. (IIT Madras)' },
        labs: ['Strength of Materials Lab', 'Thermal Engineering Lab', 'Robotics & Mechatronics Lab'],
        icon: 'fa-gears',
        color: '#dc2626',
        featured: false
      },
      {
        departmentName: 'Civil Engineering',
        departmentCode: 'CIVIL',
        description: 'Focuses on sustainable green infrastructure, smart city development, structural engineering, and earthquake-resistant designs.',
        degree: 'B.E.',
        duration: '4 Years',
        intake: 60,
        eligibility: 'Passed 10+2 with Physics, Chemistry & Mathematics (Min 55% aggregate)',
        facilities: ['BIM & Smart City Planning Studio', 'Soil Mechanics & Geotech Lab', 'Structural Dynamics & Shake Table', 'Environmental Quality Lab'],
        careerOptions: ['Structural Consultant', 'Project Planning Engineer', 'Geotechnical Analyst', 'Smart City Infrastructure Specialist'],
        hod: { name: 'Dr. K. Balaji, Ph.D.', email: 'hod.civil@campusconnect.edu', qualification: 'Ph.D. (Anna University)' },
        labs: ['Surveying & GPS Lab', 'Concrete Technology Lab', 'Environmental Engineering Lab'],
        icon: 'fa-building',
        color: '#4f46e5',
        featured: false
      }
    ];

    const createdDepts = await Department.insertMany(deptData);
    console.log(`[Seed]: Created ${createdDepts.length} departments.`);

    // Map departments by code for easy reference
    const deptMap = {};
    createdDepts.forEach(d => { deptMap[d.departmentCode] = d._id; });

    // 3. Seed Cutoffs (2023, 2024, 2025, 2026 across categories)
    const cutoffRecords = [];
    const categories = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'ST'];
    const years = [2023, 2024, 2025, 2026];

    // Base rank multipliers and scores for realistic cutoffs
    const deptBaseMetrics = {
      'CSE':   { baseRank: 2800, baseCutoff: 196.0 },
      'AI&DS': { baseRank: 4200, baseCutoff: 194.0 },
      'IT':    { baseRank: 5100, baseCutoff: 192.5 },
      'ECE':   { baseRank: 7200, baseCutoff: 189.5 },
      'EEE':   { baseRank: 11000, baseCutoff: 184.0 },
      'MECH':  { baseRank: 15500, baseCutoff: 178.0 },
      'CIVIL': { baseRank: 19200, baseCutoff: 172.5 }
    };

    const catAdjustments = {
      'OC':  { rankMult: 1.0,  scoreDiff: 0 },
      'BC':  { rankMult: 1.35, scoreDiff: -3.0 },
      'BCM': { rankMult: 1.45, scoreDiff: -4.0 },
      'MBC': { rankMult: 1.70, scoreDiff: -6.5 },
      'SC':  { rankMult: 2.80, scoreDiff: -16.0 },
      'ST':  { rankMult: 3.60, scoreDiff: -24.0 }
    };

    for (const [code, id] of Object.entries(deptMap)) {
      const metric = deptBaseMetrics[code] || { baseRank: 8000, baseCutoff: 185.0 };

      for (const year of years) {
        // slight yearly drift
        const yearShiftRank = (2026 - year) * 220;
        const yearShiftCutoff = (year - 2023) * 0.5;

        for (const cat of categories) {
          const adj = catAdjustments[cat];
          const closingRank = Math.round((metric.baseRank * adj.rankMult) - yearShiftRank);
          const openingRank = Math.max(120, Math.round(closingRank * 0.45));
          const closingCutoff = Number(Math.min(199.5, Math.max(120.0, metric.baseCutoff + adj.scoreDiff + yearShiftCutoff)).toFixed(2));

          cutoffRecords.push({
            departmentId: id,
            academicYear: year,
            category: cat,
            quota: 'General / State Quota',
            openingRank,
            closingRank,
            closingCutoff,
            counsellingRound: 1
          });
        }

        // Add Management Quota for OC and BC
        cutoffRecords.push({
          departmentId: id,
          academicYear: year,
          category: 'OC',
          quota: 'Management Quota',
          openingRank: Math.round(metric.baseRank * 2.2),
          closingRank: Math.round(metric.baseRank * 3.4),
          closingCutoff: Number((metric.baseCutoff - 12.0).toFixed(2)),
          counsellingRound: 1
        });
      }
    }

    await Cutoff.insertMany(cutoffRecords);
    console.log(`[Seed]: Created ${cutoffRecords.length} cutoff records across 2023-2026.`);

    // 4. Seed Fee Structures
    const feeData = [
      { dept: 'CSE',   tuition: 125000, exam: 6000, other: 19000 },
      { dept: 'AI&DS', tuition: 130000, exam: 6000, other: 22000 },
      { dept: 'IT',    tuition: 115000, exam: 6000, other: 18000 },
      { dept: 'ECE',   tuition: 105000, exam: 6000, other: 17000 },
      { dept: 'EEE',   tuition: 95000,  exam: 6000, other: 15000 },
      { dept: 'MECH',  tuition: 90000,  exam: 6000, other: 16000 },
      { dept: 'CIVIL', tuition: 85000,  exam: 6000, other: 14000 }
    ];

    const feeRecords = feeData.map(f => {
      const total = f.tuition + f.exam + f.other;
      return {
        departmentId: deptMap[f.dept],
        academicYear: 2026,
        tuitionFee: f.tuition,
        hostelFee: 85000,
        transportFee: 32000,
        examinationFee: f.exam,
        otherFees: f.other,
        totalAnnualFee: total,
        scholarshipAvailable: true,
        scholarshipDetails: 'Up to 50% tuition waiver for cutoff score >= 195.0 / state rank < 2000.'
      };
    });

    await FeeStructure.insertMany(feeRecords);
    console.log(`[Seed]: Created ${feeRecords.length} fee structures.`);

    // 5. Seed Hostels
    const hostels = await Hostel.insertMany([
      {
        hostelName: 'Aryabhatta Men\'s Hall of Residence',
        type: 'Boys',
        capacity: 650,
        availableBeds: 58,
        fees: 85000,
        roomTypes: [
          { typeName: '2-Sharing Deluxe (Air-Conditioned)', occupancy: 2, fee: 115000, isAc: true, available: true },
          { typeName: '3-Sharing Non-AC Standard', occupancy: 3, fee: 85000, isAc: false, available: true },
          { typeName: '4-Sharing Economy', occupancy: 4, fee: 72000, isAc: false, available: true }
        ],
        facilities: [
          'High-Speed Wi-Fi 6 (100 Mbps)',
          'Air-Conditioned Study Lounges',
          'Modern Gymnasium & Fitness Center',
          'Biometric Smart Turnstile Access',
          'Steam Cooking Hygienic Dining Mess',
          'Indoor Sports (Table Tennis, Foosball, Carrom)',
          'In-house Laundry Service & Solar Water Heaters',
          '24/7 Security CCTV & Medical Emergency Room'
        ],
        messDetails: {
          messType: 'South Indian & North Indian (Pure Veg + Non-Veg 3 days/week)',
          cuisine: ['Idli/Dosa/Poori', 'Chapati/Paneer', 'Chicken/Fish Curry', 'Variety Rice', 'Ice Cream/Sweets'],
          timings: 'Breakfast: 7:15 - 8:45 AM | Lunch: 12:30 - 2:00 PM | Snacks: 5:00 - 6:00 PM | Dinner: 7:30 - 9:30 PM',
          dietaryNotes: 'Unlimited milk, eggs, seasonal fruits, RO treated alkaline drinking water.'
        },
        rules: [
          'Entry gate closes strictly at 9:00 PM on weekdays and 9:30 PM on weekends.',
          'Ragging is strictly prohibited with zero-tolerance policy.',
          'Electronic gadgets and laptops permitted; heating appliances not allowed.',
          'Biometric check-in mandatory at entry and exit.'
        ],
        contact: {
          wardenName: 'Prof. K. Venkatesh (Chief Warden - Boys)',
          phone: '+91 98400 11223',
          email: 'warden.boys@campusconnect.edu'
        }
      },
      {
        hostelName: 'Kalpana Chawla Women\'s Hall of Residence',
        type: 'Girls',
        capacity: 550,
        availableBeds: 42,
        fees: 85000,
        roomTypes: [
          { typeName: '2-Sharing Deluxe (Air-Conditioned)', occupancy: 2, fee: 115000, isAc: true, available: true },
          { typeName: '3-Sharing Non-AC Standard', occupancy: 3, fee: 85000, isAc: false, available: true },
          { typeName: '4-Sharing Economy', occupancy: 4, fee: 72000, isAc: false, available: true }
        ],
        facilities: [
          '24/7 Dedicated Female Security Staff & CCTV',
          'High-Speed Wi-Fi 6 (100 Mbps)',
          'Quiet Air-Conditioned Library Reading Floor',
          'Aerobics & Yoga Studio',
          'In-house Clinic with Resident Doctor & Nurse',
          'Automated Laundry Facility & Ironing Station',
          'Hygienic Multi-Cuisine Dining Hall',
          'Visitor Lounge & Parent Waiting Suite'
        ],
        messDetails: {
          messType: 'Nutritious South Indian, North Indian & Continental Options',
          cuisine: ['Healthy Multigrain Breakfast', 'Dal Tadka, Paneer Butter Masala', 'Biryani & Chicken Fry', 'Fresh Salads'],
          timings: 'Breakfast: 7:15 - 8:45 AM | Lunch: 12:30 - 2:00 PM | Snacks: 4:45 - 5:45 PM | Dinner: 7:15 - 9:15 PM',
          dietaryNotes: 'Custom diet for unwell students, fresh fruits provided daily.'
        },
        rules: [
          'Curfew timing is 8:30 PM. Outing pass required via student portal.',
          'Visitors permitted only in designated Ground Floor reception lounge.',
          'Quiet hours strictly maintained after 10:30 PM for study comfort.',
          'Biometric attendance recorded before dinner.'
        ],
        contact: {
          wardenName: 'Dr. S. Meenakshi (Chief Warden - Girls)',
          phone: '+91 98400 44556',
          email: 'warden.girls@campusconnect.edu'
        }
      }
    ]);
    console.log(`[Seed]: Created ${hostels.length} hostel facilities.`);

    // 6. Seed Transport Routes
    const transportRoutes = await Transport.insertMany([
      {
        routeName: 'Central Station - Koyambedu Express',
        routeNumber: 'Route 1A',
        startingPoint: 'Chennai Central Railway Station',
        stops: [
          { stopName: 'Chennai Central (Gate 2)', time: '06:30 AM', landmark: 'Opposite Railway Hotel', order: 1 },
          { stopName: 'Egmore Station', time: '06:45 AM', landmark: 'Gandhi Irwin Road', order: 2 },
          { stopName: 'Kilpauk Medical College', time: '07:02 AM', landmark: 'KMC Bus Stand', order: 3 },
          { stopName: 'Koyambedu CMBT', time: '07:20 AM', landmark: 'Rohini Theatre Junction', order: 4 },
          { stopName: 'Maduravoyal Flyover', time: '07:35 AM', landmark: 'Bypass Junction', order: 5 },
          { stopName: 'CampusConnect Main Gate', time: '08:15 AM', landmark: 'Campus Portico', order: 6 }
        ],
        timing: 'Morning: 06:30 AM | Evening Return: 05:15 PM',
        distance: '34 km',
        fee: 32000,
        availableDays: 'Monday to Friday (Special schedule during exams)',
        busCapacity: 55,
        driverContact: { name: 'M. Selvaraj', phone: '+91 94440 10203' }
      },
      {
        routeName: 'Tambaram - Chromepet - Guindy Corridor',
        routeNumber: 'Route 7B',
        startingPoint: 'Tambaram Sanatorium',
        stops: [
          { stopName: 'Tambaram Sanatorium', time: '06:40 AM', landmark: 'MEPZ Signal', order: 1 },
          { stopName: 'Chromepet MIT Gate', time: '06:52 AM', landmark: 'MIT Campus Overbridge', order: 2 },
          { stopName: 'Pallavaram', time: '07:05 AM', landmark: 'ESI Hospital Junction', order: 3 },
          { stopName: 'Guindy Kathipara', time: '07:25 AM', landmark: 'Metro Pillar 42', order: 4 },
          { stopName: 'Porur Toll Plaza', time: '07:45 AM', landmark: 'DLF IT Park Gate', order: 5 },
          { stopName: 'CampusConnect Main Gate', time: '08:15 AM', landmark: 'Campus Portico', order: 6 }
        ],
        timing: 'Morning: 06:40 AM | Evening Return: 05:15 PM',
        distance: '38 km',
        fee: 34000,
        availableDays: 'Monday to Friday',
        busCapacity: 55,
        driverContact: { name: 'R. Balamurugan', phone: '+91 94440 20304' }
      },
      {
        routeName: 'Anna Nagar - Mogappair - Ambattur Link',
        routeNumber: 'Route 12C',
        startingPoint: 'Anna Nagar Roundtana',
        stops: [
          { stopName: 'Anna Nagar Roundtana', time: '06:45 AM', landmark: 'Near Metro Station', order: 1 },
          { stopName: 'Thirumangalam Metro', time: '06:55 AM', landmark: 'VR Mall Junction', order: 2 },
          { stopName: 'Mogappair West', time: '07:10 AM', landmark: 'Bus Terminus', order: 3 },
          { stopName: 'Ambattur Estate OT', time: '07:25 AM', landmark: 'Telephone Exchange', order: 4 },
          { stopName: 'CampusConnect Main Gate', time: '08:15 AM', landmark: 'Campus Portico', order: 5 }
        ],
        timing: 'Morning: 06:45 AM | Evening Return: 05:15 PM',
        distance: '28 km',
        fee: 30000,
        availableDays: 'Monday to Friday',
        busCapacity: 55,
        driverContact: { name: 'P. Anthony', phone: '+91 94440 30405' }
      },
      {
        routeName: 'Velachery - OMR IT Expressway',
        routeNumber: 'Route 19D',
        startingPoint: 'Velachery MRTS Station',
        stops: [
          { stopName: 'Velachery MRTS', time: '06:35 AM', landmark: 'Opposite Phoenix Marketcity', order: 1 },
          { stopName: 'Tharamani Tidel Park', time: '06:50 AM', landmark: 'Tidel Main Gate', order: 2 },
          { stopName: 'Perungudi Toll', time: '07:05 AM', landmark: 'Kandanchavadi Junction', order: 3 },
          { stopName: 'Sholinganallur Junction', time: '07:25 AM', landmark: 'ELCOT SEZ Gate', order: 4 },
          { stopName: 'CampusConnect Main Gate', time: '08:15 AM', landmark: 'Campus Portico', order: 5 }
        ],
        timing: 'Morning: 06:35 AM | Evening Return: 05:15 PM',
        distance: '42 km',
        fee: 36000,
        availableDays: 'Monday to Friday',
        busCapacity: 55,
        driverContact: { name: 'K. Senthil', phone: '+91 94440 40506' }
      }
    ]);
    console.log(`[Seed]: Created ${transportRoutes.length} bus routes.`);

    // 7. Seed Placements
    const placements = await Placement.insertMany([
      {
        companyName: 'Google',
        industry: 'Product Companies',
        package: '32 - 44 LPA',
        minPackageLPA: 32.0,
        maxPackageLPA: 44.0,
        jobRole: 'Software Engineer - University Graduate',
        hiringYear: 2025,
        department: ['CSE', 'IT', 'AI&DS'],
        website: 'https://careers.google.com',
        tier: 'Super Dream (15+ LPA)',
        offersCount: 8,
        selectionProcess: 'Online Coding (HackerEarth) -> Tech Interview 1 (DSA) -> Tech Interview 2 (System Design) -> Googliness Round'
      },
      {
        companyName: 'Microsoft',
        industry: 'Product Companies',
        package: '28 - 42 LPA',
        minPackageLPA: 28.0,
        maxPackageLPA: 42.0,
        jobRole: 'Software Development Engineer (SDE-1)',
        hiringYear: 2025,
        department: ['CSE', 'IT', 'AI&DS', 'ECE'],
        website: 'https://careers.microsoft.com',
        tier: 'Super Dream (15+ LPA)',
        offersCount: 12,
        selectionProcess: 'Online Assessment -> 3 rounds of Technical & Algorithmic Problem Solving -> HR / Culture Fit'
      },
      {
        companyName: 'Amazon',
        industry: 'Product Companies',
        package: '26 - 38 LPA',
        minPackageLPA: 26.0,
        maxPackageLPA: 38.0,
        jobRole: 'Software Development Engineer',
        hiringYear: 2025,
        department: ['CSE', 'IT', 'AI&DS', 'ECE'],
        website: 'https://amazon.jobs',
        tier: 'Super Dream (15+ LPA)',
        offersCount: 16,
        selectionProcess: 'Online Assessment (Debug, Coding, Work Styles) -> 3 Technical Video Interviews'
      },
      {
        companyName: 'Cisco Systems',
        industry: 'Product Companies',
        package: '16 - 22 LPA',
        minPackageLPA: 16.0,
        maxPackageLPA: 22.0,
        jobRole: 'Software / Network Consulting Engineer',
        hiringYear: 2025,
        department: ['CSE', 'IT', 'ECE', 'AI&DS'],
        website: 'https://jobs.cisco.com',
        tier: 'Super Dream (15+ LPA)',
        offersCount: 18,
        selectionProcess: 'Aptitude & Coding Round -> 2 Technical Rounds (Networking & OS) -> Managerial'
      },
      {
        companyName: 'Goldman Sachs',
        industry: 'Finance & FinTech',
        package: '22 - 28 LPA',
        minPackageLPA: 22.0,
        maxPackageLPA: 28.0,
        jobRole: 'Operations & Engineering Analyst',
        hiringYear: 2025,
        department: ['CSE', 'IT', 'AI&DS', 'ECE'],
        website: 'https://www.goldmansachs.com/careers',
        tier: 'Super Dream (15+ LPA)',
        offersCount: 9,
        selectionProcess: 'Aptitude, Math & Coding -> 3 Technical & Quantitative Rounds'
      },
      {
        companyName: 'Zoho Corporation',
        industry: 'Product Companies',
        package: '8.5 - 14 LPA',
        minPackageLPA: 8.5,
        maxPackageLPA: 14.0,
        jobRole: 'Member Technical Staff (Software Developer)',
        hiringYear: 2025,
        department: ['CSE', 'IT', 'AI&DS', 'ECE', 'EEE', 'MECH', 'CIVIL'],
        website: 'https://www.zoho.com/careers',
        tier: 'Dream (8-15 LPA)',
        offersCount: 65,
        selectionProcess: 'Aptitude & C Programming -> Advanced Programming (Console App) -> Tech Interview -> HR'
      },
      {
        companyName: 'TCS Digital & Prime',
        industry: 'IT & Cloud Services',
        package: '7.5 - 11.5 LPA',
        minPackageLPA: 7.5,
        maxPackageLPA: 11.5,
        jobRole: 'Digital Technology Specialist',
        hiringYear: 2025,
        department: ['CSE', 'IT', 'AI&DS', 'ECE', 'EEE', 'MECH'],
        website: 'https://www.tcs.com/careers',
        tier: 'Dream (8-15 LPA)',
        offersCount: 92,
        selectionProcess: 'TCS NQT (Cognitive + Advanced Coding) -> Technical Interview -> HR'
      },
      {
        companyName: 'Robert Bosch',
        industry: 'Automotive & EV',
        package: '8 - 12 LPA',
        minPackageLPA: 8.0,
        maxPackageLPA: 12.0,
        jobRole: 'Embedded & Mobility Engineer',
        hiringYear: 2025,
        department: ['ECE', 'EEE', 'MECH'],
        website: 'https://www.bosch.in/careers',
        tier: 'Dream (8-15 LPA)',
        offersCount: 24,
        selectionProcess: 'Technical Assessment (C, MATLAB, Circuits) -> Technical Round -> HR'
      },
      {
        companyName: 'Larsen & Toubro (L&T)',
        industry: 'Core Engineering',
        package: '6.5 - 9.5 LPA',
        minPackageLPA: 6.5,
        maxPackageLPA: 9.5,
        jobRole: 'Graduate Engineer Trainee (GET)',
        hiringYear: 2025,
        department: ['MECH', 'CIVIL', 'EEE'],
        website: 'https://www.larsentoubro.com/corporate/careers',
        tier: 'Regular (4-8 LPA)',
        offersCount: 30,
        selectionProcess: 'Domain Technical Test -> Group Discussion -> Technical Interview -> Medical Examination'
      },
      {
        companyName: 'Deloitte Consulting',
        industry: 'Consulting & Analytics',
        package: '8.5 - 12.5 LPA',
        minPackageLPA: 8.5,
        maxPackageLPA: 12.5,
        jobRole: 'Analyst - Technology Consulting',
        hiringYear: 2025,
        department: ['CSE', 'IT', 'AI&DS', 'ECE'],
        website: 'https://www2.deloitte.com/careers',
        tier: 'Dream (8-15 LPA)',
        offersCount: 38,
        selectionProcess: 'Online Aptitude & Versant Test -> Group Case Study -> Technical / Partner Round'
      },
      {
        companyName: 'Hyundai Motors India',
        industry: 'Automotive & EV',
        package: '7 - 10 LPA',
        minPackageLPA: 7.0,
        maxPackageLPA: 10.0,
        jobRole: 'R&D Engineer - EV Systems',
        hiringYear: 2025,
        department: ['MECH', 'EEE', 'ECE'],
        website: 'https://www.hyundai.com/in',
        tier: 'Dream (8-15 LPA)',
        offersCount: 15,
        selectionProcess: 'Technical Assessment -> Technical Interview -> HR'
      },
      {
        companyName: 'Cognizant GenC Elevate',
        industry: 'IT & Cloud Services',
        package: '4.5 - 6.5 LPA',
        minPackageLPA: 4.5,
        maxPackageLPA: 6.5,
        jobRole: 'Programmer Analyst Trainee',
        hiringYear: 2025,
        department: ['CSE', 'IT', 'AI&DS', 'ECE', 'EEE', 'MECH', 'CIVIL'],
        website: 'https://careers.cognizant.com',
        tier: 'Regular (4-8 LPA)',
        offersCount: 110,
        selectionProcess: 'Skill Assessment -> Tech Interview -> Communication Verification'
      }
    ]);
    console.log(`[Seed]: Created ${placements.length} placement records.`);

    // 8. Seed Admission Data
    const admission = await Admission.create({
      admissionYear: 2026,
      title: 'Undergraduate B.E. / B.Tech Admissions 2026',
      eligibility: 'A pass in the HSC (Academic: 10+2) or its equivalent with a minimum average of 60% in Mathematics, Physics and Chemistry put together. Vocational stream candidates eligible with vocational subjects related to engineering.',
      counsellingProcess: [
        {
          stepNumber: 1,
          title: 'Online Application & Registration',
          description: 'Register on the official admission portal with 12th standard registration details, personal credentials, and upload scanned academic certificates.'
        },
        {
          stepNumber: 2,
          title: 'Merit List & Random Number Generation',
          description: 'State counselling authority generates individual candidate merit rank based on aggregate 200 marks (Maths: 100, Physics: 50, Chemistry: 50).'
        },
        {
          stepNumber: 3,
          title: 'Choice Filling & Department Locking',
          description: 'Log into choice-filling portal during designated counselling round and select CampusConnect Institute of Technology with your preferred branch choices (CSE, AI&DS, IT, etc.) in priority order.'
        },
        {
          stepNumber: 4,
          title: 'Provisional Seat Allotment',
          description: 'System automatically allocates seat based on merit rank, category reservation, and candidate choice preferences. Download Provisional Allotment Order.'
        },
        {
          stepNumber: 5,
          title: 'Physical Reporting & Document Verification',
          description: 'Report to CampusConnect Admissions Center with original certificates, pay first semester tuition fees, and finalize hostel/bus reservation.'
        }
      ],
      requiredDocuments: [
        { name: '10th Standard Mark Sheet (SSLC)', mandatory: true, description: 'Proof of date of birth and secondary education qualification.', category: 'Academic' },
        { name: '12th Standard / HSC Mark Sheet', mandatory: true, description: 'Mandatory proof of engineering eligibility cutoff subjects.', category: 'Academic' },
        { name: 'Transfer Certificate (TC)', mandatory: true, description: 'Original TC issued by previous school/junior college.', category: 'Academic' },
        { name: 'Community / Caste Certificate', mandatory: false, description: 'Required for BC, BCM, MBC, SC, ST category reservation and fee concession.', category: 'Reservation' },
        { name: 'Nativity Certificate', mandatory: false, description: 'Mandatory if 8th to 12th standard was completed outside the state.', category: 'Reservation' },
        { name: 'Income Certificate', mandatory: false, description: 'Required for availing First Graduate tuition fee waiver and Post-Matric scholarships.', category: 'Financial' },
        { name: 'Government ID (Aadhaar / Passport)', mandatory: true, description: 'Aadhaar card copy with updated biometric status.', category: 'Identification' },
        { name: 'Passport Size Photographs (6 Copies)', mandatory: true, description: 'Recent color passport-sized photos with white background.', category: 'Identification' },
        { name: 'Counselling Allotment Order', mandatory: true, description: 'Original allotment order issued by the Single Window Counselling Authority.', category: 'Admission' }
      ],
      importantDates: [
        { event: 'Online Application Portal Opens', date: 'May 05, 2026', status: 'Completed' },
        { event: 'Last Date for Online Submission', date: 'June 10, 2026', status: 'Completed' },
        { event: 'Publication of Rank & Merit List', date: 'June 25, 2026', status: 'Ongoing' },
        { event: 'Round 1 Choice Filling (Rank 1 - 25,000)', date: 'July 05 - July 09, 2026', status: 'Upcoming' },
        { event: 'Round 2 Choice Filling (Rank 25,001 - 65,000)', date: 'July 15 - July 19, 2026', status: 'Upcoming' },
        { event: 'Orientation & Induction Commencement', date: 'August 10, 2026', status: 'Upcoming' }
      ],
      helpline: {
        phone: '+91 44 2855 0101 / +91 94440 00111',
        email: 'admissions@campusconnect.edu',
        timings: 'Monday to Saturday: 9:00 AM - 5:30 PM',
        address: 'Admissions & Counselling Directorate, Ground Floor, Administrative Block, CampusConnect'
      },
      faqList: [
        {
          question: 'Can I apply for both Government Quota and Management Quota?',
          answer: 'Yes, candidates can participate in State Single Window Counselling and concurrently apply for institutional Management Quota seats.'
        },
        {
          question: 'Is hostel accommodation guaranteed for outstation students?',
          answer: 'Yes! All first-year outstation engineering students are guaranteed on-campus hostel accommodation upon early booking.'
        },
        {
          question: 'What is the cutoff calculation formula for engineering?',
          answer: 'Engineering cutoff is calculated out of 200: Mathematics marks (100) + Physics marks divided by 2 (50) + Chemistry marks divided by 2 (50).'
        }
      ]
    });
    console.log('[Seed]: Created Admission guidance records.');

    // 9. Seed Users (Admin, Student, Prospective Student)
    // Pre-save hook will hash passwords automatically
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@campusconnect.edu',
      password: 'Admin@123',
      role: 'Admin',
      phone: '+91 98400 99999'
    });
    await adminUser.save();

    const studentUser = new User({
      name: 'Rohit Sharma',
      email: 'student@campusconnect.edu',
      password: 'Student@123',
      role: 'Student',
      phone: '+91 98400 88888',
      counsellingRank: 3850,
      category: 'OC',
      favorites: {
        departments: [deptMap['CSE'], deptMap['AI&DS']],
        placements: [placements[0]._id, placements[1]._id]
      },
      checklist: [
        { documentName: '10th Standard Mark Sheet', completed: true },
        { documentName: '12th Standard / HSC Mark Sheet', completed: true },
        { documentName: 'Transfer Certificate (TC)', completed: true },
        { documentName: 'Community / Caste Certificate', completed: true },
        { documentName: 'Government ID Proof (Aadhaar / Passport)', completed: true },
        { documentName: 'Passport Size Photographs (6 copies)', completed: true },
        { documentName: 'Nativity / Domicile Certificate', completed: false },
        { documentName: 'Income Certificate (for Fee Waiver/Scholarship)', completed: false },
        { documentName: 'Counselling Call Letter / Allotment Order', completed: false }
      ]
    });
    await studentUser.save();

    const prospectUser = new User({
      name: 'Priya Sundaram',
      email: 'prospect@campusconnect.edu',
      password: 'Prospect@123',
      role: 'Prospective Student',
      phone: '+91 98400 77777',
      counsellingRank: 7800,
      category: 'BC',
      favorites: {
        departments: [deptMap['IT'], deptMap['ECE']]
      },
      checklist: [
        { documentName: '10th Standard Mark Sheet', completed: true },
        { documentName: '12th Standard / HSC Mark Sheet', completed: true },
        { documentName: 'Transfer Certificate (TC)', completed: false },
        { documentName: 'Government ID Proof (Aadhaar / Passport)', completed: true },
        { documentName: 'Passport Size Photographs (6 copies)', completed: false }
      ]
    });
    await prospectUser.save();

    console.log('[Seed]: Created 3 default users (Admin, Student, Prospective Student).');

    // 10. Sample Chat History
    await ChatHistory.create({
      userId: studentUser._id,
      sessionId: 'demo-session',
      question: 'What is the cutoff for CSE?',
      answer: 'For Computer Science & Engineering (CSE), the 2025 General Quota closing cutoff for OC was 195.5 with closing rank #3120, and for BC it was 192.5 with closing rank #5200.',
      intent: 'CUTOFF_INQUIRY',
      suggestedFollowUps: ['What are the fees for CSE?', 'What companies recruit from CSE?']
    });

    console.log('====================================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
    console.log('Test Credentials:');
    console.log('Admin User   : admin@campusconnect.edu    | Password: Admin@123');
    console.log('Student User : student@campusconnect.edu  | Password: Student@123');
    console.log('Prospect User: prospect@campusconnect.edu | Password: Prospect@123');
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDB();
