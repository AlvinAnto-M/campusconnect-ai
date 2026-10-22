const Admission = require('../models/Admission');
const College = require('../models/College');

// @desc    Get admission guidance & procedures
// @route   GET /api/admission
// @access  Public
const getAdmissionInfo = async (req, res, next) => {
  try {
    const admission = await Admission.findOne({ admissionYear: 2026 }) || await Admission.findOne();
    res.json({
      success: true,
      data: admission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admission info (Admin)
// @route   PUT /api/admission
// @access  Private/Admin
const updateAdmissionInfo = async (req, res, next) => {
  try {
    let admission = await Admission.findOne({ admissionYear: 2026 });
    if (admission) {
      admission = await Admission.findByIdAndUpdate(admission._id, req.body, { new: true, runValidators: true });
    } else {
      admission = await Admission.create(req.body);
    }

    res.json({
      success: true,
      message: 'Admission details updated successfully!',
      data: admission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get college details & Campus Explorer information
// @route   GET /api/admission/college
// @access  Public
const getCollegeInfo = async (req, res, next) => {
  try {
    const college = await College.findOne();

    // Campus Explorer blocks and zones
    const campusBlocks = [
      {
        id: 'acad-block',
        title: 'Academic & Lecture Complex',
        code: 'Block A & B',
        tag: 'Academics',
        icon: 'fa-landmark',
        description: 'Multi-storey smart air-conditioned smart classrooms, amphitheaters, and faculty cabins equipped with interactive digital boards and lecture capture audio-visual systems.',
        facilities: ['60 Smart Lecture Halls', 'Department HOD Offices', 'Faculty Cabins', 'Dean Office']
      },
      {
        id: 'computing-hub',
        title: 'Turing Advanced Computing & AI Hub',
        code: 'Block C',
        tag: 'Labs & Research',
        icon: 'fa-microchip',
        description: 'Dedicated high-performance cluster computing hub housing NVIDIA GPU workstations, cloud computing setups, IoT and cyber security sandboxes.',
        facilities: ['NVIDIA AI Supercomputing Lab', 'AWS & Cloud Innovation Lab', 'Cyber Defense Range', 'Apple iOS Dev Lab']
      },
      {
        id: 'library',
        title: 'Central Digital Knowledge Center',
        code: 'Block D',
        tag: 'Library',
        icon: 'fa-book-open-reader',
        description: 'Automated RFID library housing over 1,20,000 volumes, 500+ IEEE/Springer journals, digital discovery stations, and 24/7 quiet air-conditioned study lounges.',
        facilities: ['1.2 Lakh Books', 'IEEE/ACM Digital Access', 'Quiet Discussion Rooms', '24/7 Reading Lounge']
      },
      {
        id: 'hostels',
        title: 'Student Residential Quarters',
        code: 'North & South Towers',
        tag: 'Hostel',
        icon: 'fa-hotel',
        description: 'Safe, gated residential dormitories with biometric access, high-speed Wi-Fi, air-conditioned rooms, gymnasium, recreation halls, and multi-cuisine hygienic dining mess.',
        facilities: ['Separate Boys & Girls Towers', 'RO Purified Water', 'Gym & Table Tennis', '24/7 Warden & Security']
      },
      {
        id: 'transport',
        title: 'Central Transport Fleet Depot',
        code: 'South Gate Gate-3',
        tag: 'Logistics',
        icon: 'fa-bus',
        description: 'Coordinated terminal for over 35+ air-conditioned and deluxe bus routes covering 60+ boarding points across the city with real-time GPS tracking.',
        facilities: ['35+ Express Buses', 'Covered Bus Bay', 'Driver Rest Area', 'GPS Control Desk']
      },
      {
        id: 'sports',
        title: 'Olympic Sports Arena & Indoor Stadium',
        code: 'East Campus',
        tag: 'Sports & Wellness',
        icon: 'fa-volleyball',
        description: 'World-class sports infrastructure featuring a 400m synthetic athletic track, football ground, indoor badminton courts, basketball courts, and fitness centers.',
        facilities: ['Synthetic Athletic Track', 'Floodlit Basketball Arena', 'Indoor Badminton Courts', 'Olympic Gym']
      },
      {
        id: 'placement-cell',
        title: 'Corporate Career & Placement Center',
        code: 'Block E - Level 2',
        tag: 'Placements',
        icon: 'fa-briefcase',
        description: 'Corporate briefing suites, 20 interview conference rooms, mock group-discussion lounges, and corporate presentation auditoriums.',
        facilities: ['20 Air-conditioned Interview Rooms', '2 GD Conference Lounges', 'Pre-Placement Talk Auditorium']
      },
      {
        id: 'canteen',
        title: 'Food Court & Student Cafe',
        code: 'Central Plaza',
        tag: 'Food & Recreation',
        icon: 'fa-utensils',
        description: 'Vibrant modern food court with multi-cuisine dining options, healthy fresh juice bars, coffee corners, and shaded outdoor garden seating.',
        facilities: ['FSSAI Certified Kitchens', 'Multi-Cuisine Counters', 'Coffee Bar', 'Outdoor Seating Garden']
      }
    ];

    res.json({
      success: true,
      data: college,
      campusExplorer: campusBlocks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdmissionInfo,
  updateAdmissionInfo,
  getCollegeInfo
};
