# CAMPUSCONNECT AI
### Smart College Information, Admission Guidance & Student Assistance Portal

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org)
[![AngularJS](https://img.shields.io/badge/AngularJS-1.8.2-red.svg)](https://angularjs.org)
[![Express](https://img.shields.io/badge/Express-4.19-blue.svg)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://mongodb.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com)
[![License](https://img.shields.io/badge/License-Academic%20Project-orange.svg)](#)

---

## 1. Project Overview

**CampusConnect AI** is an enterprise-grade full-stack web application engineered to bridge the information gap for:
1. **Prospective Students & 12th Standard Pass-outs** preparing for Single-Window Engineering Admissions and Choice Filling.
2. **Parents & Guardians** seeking factual, transparent clarity regarding tuition costs, hostel safety, transport bus stops, and placement packages.
3. **Enrolled College Students** tracking career prospects, academic milestones, and campus facilities.
4. **College Administrators** managing departments, cutoff thresholds, fee tables, and recruiter profiles.

The application combines a high-performance **Node.js/Express REST backend** with **MongoDB/Mongoose** and a modular, production-ready **AngularJS 1.8 Single Page Application (SPA)** architecture, augmented by an intelligent context-aware **AI Chatbot**.

---

## 2. Problem Statement

Every admission season, prospective students and parents face severe information asymmetry:
* College websites present static, promotional material without historical cutoff comparisons.
* Students lack tools to algorithmically assess: *"Can I get CSE or AI&DS with my counselling rank?"*
* Total cost of education (Tuition + Examination + Hostel Room + Transport Bus + Scholarship) is fragmented, making financial planning difficult.
* First-time applicants miss critical counselling deadlines or arrive unprepared without required physical verification documents.

---

## 3. Objectives

* Provide automated historical cutoff comparison tools (`Likely`, `Borderline`, `Exceeded`) across 4 academic cycles (2023–2026).
* Provide an interactive 4-Year Student Cost Calculator with live scholarship and residential toggles.
* Provide an interactive Admission Readiness Checklist with live completion tracking.
* Deploy an integrated 24/7 AI Chatbot grounded strictly in the institutional MongoDB knowledge base.
* Exemplify all core **AngularJS concepts** (Controllers, Services, Directives, Filters, Routing, Dependency Injection, Form Validation) with clean separation of concerns.

---

## 4. Key Modules & Innovative Features

### Core Modules
* **Dashboard:** Metrics banner, quick access portals, flagship departments, recent corporate visits, and admission alerts.
* **Departments Module:** Degree filter (B.Tech / B.E.), minimum intake filter, laboratory catalog, career options, and HOD contacts.
* **Cutoffs & Prediction Module:** Historical records filter (OC, BC, BCM, MBC, SC, ST) across 4 cycles with counselling rounds.
* **Fees & Finance Module:** Itemized tuition, examination, and amenities fees.
* **Hostel Accommodation:** Boys & Girls blocks, AC/Non-AC room tiers, bed vacancy counters, mess menu highlights, and curfew rules.
* **Transport Module:** Routes catalog, boarding point locator, and sequential visual stop timelines.
* **Placements Module:** Verified compensation packages (4 to 44 LPA), compensation tiers, job profiles, and eligible branches.
* **Admin Management Console:** Full CRUD on departments, cutoffs, placements, and bus routes protected by JWT and Admin authorization.

### 6 Standout Innovative Features
1. **Smart Department Comparison:** Side-by-side comparative matrix of up to 3 chosen engineering branches.
2. **Student College Cost Calculator:** Dynamic 4-year financial modeling tool calculating tuition, hostel tiers, bus fees, and scholarship deductions.
3. **Admission Readiness Checklist:** Interactive dossier checklist with progress bar tracking (*"6 / 9 documents ready - 67%"*) and print capabilities.
4. **Personalized Student Dashboard:** User profile retaining state counselling rank, saved favorite branches, and custom bookmark recommendations.
5. **Cutoff Trend Analytics:** Interactive line charts (powered by Chart.js) depicting closing score trajectories across 2023, 2024, 2025, and 2026.
6. **Smart Campus Explorer:** Interactive walkthrough across Academic Blocks, Computing & AI Hub, Digital Library, Sports Arena, and Corporate Suites.

---

## 5. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | AngularJS 1.8.2 (`ngRoute`, `ngAnimate`, `ngSanitize`) |
| **Styling & Icons** | Bootstrap 5.3.3, Custom CSS3, FontAwesome 6, Google Fonts (*Plus Jakarta Sans*, *Outfit*) |
| **Data Visualizations** | Chart.js 3.9 |
| **Backend Runtime** | Node.js (v18+) & Express.js 4.19 |
| **Database & ODM** | MongoDB (v6.0+) & Mongoose 8.3 |
| **Security & Auth** | JSON Web Tokens (JWT), BcryptJS password hashing, CORS |

---

## 6. Architecture & System Design

```
+---------------------------------------------------------------------------------+
|                          CLIENT BROWSER (AngularJS 1.8 SPA)                      |
|                                                                                 |
|  [routes.js]  <---->  [$routeProvider]                                          |
|                          |                                                      |
|                          v                                                      |
|  +--------------------+------------------------+-----------------------------+  |
|  |    CONTROLLERS     |        DIRECTIVES      |           FILTERS           |  |
|  | DashboardController| <college-card>         | currencyFormat              |  |
|  | DeptController     | <department-card>      | cutoffFormat                |  |
|  | CutoffController   | <cutoff-badge>         | departmentFilter            |  |
|  | FeesController     | <loading-spinner>      | searchFilter                |  |
|  | ChatbotController  | <chatbot-widget>       | placementFilter             |  |
|  | AdminController    | <password-strength>    | tierBadgeClass              |  |
|  +--------------------+------------------------+-----------------------------+  |
|                          |                                                      |
|                          v                                                      |
|  +---------------------------------------------------------------------------+  |
|  |                              SERVICES LAYER                               |  |
|  |  apiService ($http, $q) <--> authService <--> departmentService           |  |
|  |  cutoffService <--> feesService <--> placementService <--> chatbotService|  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
                                         |
                       HTTP / RESTful APIs (JSON / Bearer JWT)
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                               EXPRESS.JS BACKEND                                |
|                                                                                 |
|  [server.js]                                                                    |
|    |---> authMiddleware (JWT Verification)                                      |
|    |---> adminMiddleware (Role-based access guard)                              |
|    |---> API Routes:                                                            |
|          /api/auth, /api/departments, /api/cutoffs, /api/fees,                  |
|          /api/hostel, /api/transport, /api/placements, /api/chatbot             |
|    |---> chatbotService (Intent detection, MongoDB Knowledge Base Querying)     |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                                 MONGODB DATABASE                                |
|                                                                                 |
|  Collections: users, colleges, departments, cutoffs, feestructures,             |
|               hostels, transports, placements, admissions, chathistories        |
+---------------------------------------------------------------------------------+
```

---

## 7. Folder Structure

```
campusconnect-ai/
│
├── client/
│   │
│   ├── index.html                           # Single Page Application root shell
│   │
│   ├── app/
│   │   ├── app.js                           # AngularJS module, interceptors, run block
│   │   ├── routes.js                        # $routeProvider definitions & auth guards
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js            # Login, registration, form validation
│   │   │   ├── dashboardController.js       # Metrics aggregation via $q.all
│   │   │   ├── departmentController.js      # Catalog & Smart Department Comparison
│   │   │   ├── cutoffController.js          # Prediction algorithm & Chart.js trends
│   │   │   ├── feesController.js            # 4-Year Cost Calculator & Comparison
│   │   │   ├── hostelController.js          # Residential dorms, mess details
│   │   │   ├── transportController.js       # Bus routes & visual timeline
│   │   │   ├── placementController.js       # Company grid & compensation tiers
│   │   │   ├── chatbotController.js         # Dedicated Q&A stream interface
│   │   │   ├── admissionController.js       # 5-step counselling & Readiness Checklist
│   │   │   ├── profileController.js         # Student dashboard & saved bookmarks
│   │   │   └── adminController.js           # Administrative CRUD console
│   │   │
│   │   ├── services/
│   │   │   ├── apiService.js                # Core $http / $q REST client
│   │   │   ├── authService.js               # JWT auth & session management
│   │   │   ├── departmentService.js         # Department API requests
│   │   │   ├── cutoffService.js             # Cutoff queries & predictive analysis
│   │   │   ├── feesService.js               # Fee structures & cost calculation
│   │   │   ├── hostelService.js             # Hostel data operations
│   │   │   ├── transportService.js          # Bus route queries
│   │   │   ├── placementService.js          # Placement records & statistics
│   │   │   ├── chatbotService.js            # AI Q&A conversation client
│   │   │   └── admissionService.js          # Admission & Campus Explorer API
│   │   │
│   │   ├── directives/
│   │   │   ├── collegeCardDirective.js      # <college-card>
│   │   │   ├── departmentCardDirective.js   # <department-card>
│   │   │   ├── cutoffBadgeDirective.js      # <cutoff-badge>
│   │   │   ├── loadingDirective.js          # <loading-spinner>
│   │   │   ├── chatbotDirective.js          # <chatbot-widget> floating AI
│   │   │   └── passwordStrengthDirective.js # <password-strength> meter
│   │   │
│   │   ├── filters/
│   │   │   ├── currencyFilter.js            # currencyFormat (e.g. ₹1,25,000)
│   │   │   ├── cutoffFilter.js              # cutoffFormat (e.g. 195.50 / 200)
│   │   │   ├── departmentFilter.js          # degree & intake array filter
│   │   │   ├── searchFilter.js              # multi-property substring search
│   │   │   └── placementFilter.js           # industry & compensation tier filter
│   │   │
│   │   ├── views/
│   │   │   ├── dashboard.html
│   │   │   ├── login.html
│   │   │   ├── register.html
│   │   │   ├── departments.html
│   │   │   ├── department-details.html
│   │   │   ├── cutoffs.html
│   │   │   ├── fees.html
│   │   │   ├── hostel.html
│   │   │   ├── transport.html
│   │   │   ├── placements.html
│   │   │   ├── admission.html
│   │   │   ├── chatbot.html
│   │   │   ├── profile.html
│   │   │   └── admin.html
│   │   │
│   │   ├── components/
│   │   │   ├── navbar/                      # Top navbar template
│   │   │   ├── sidebar/                     # Collapsible sidebar template
│   │   │   ├── chatbot/                     # Floating widget template
│   │   │   ├── department-card/             # Card directive template
│   │   │   ├── cutoff-card/                 # Cutoff snippet template
│   │   │   └── placement-card/              # Recruiter card template
│   │   │
│   │   └── assets/
│   │       └── css/style.css                # Modern responsive styling
│
├── server/
│   ├── server.js                            # Express app entry & static client server
│   │
│   ├── config/
│   │   └── db.js                            # Mongoose connection initialization
│   │
│   ├── models/
│   │   ├── User.js                          # Student, Prospective & Admin schemas
│   │   ├── College.js                       # Institution profile & accreditations
│   │   ├── Department.js                    # Branch curriculums, labs & intake
│   │   ├── Cutoff.js                        # Historical closing ranks & marks
│   │   ├── FeeStructure.js                  # Tuition, exam, lab & hostel fees
│   │   ├── Hostel.js                        # Residence blocks, room tariffs, mess
│   │   ├── Transport.js                     # Bus numbers, stops & schedules
│   │   ├── Placement.js                     # Recruiter packages, roles & tiers
│   │   ├── Admission.js                     # Eligibility, dates & checklist
│   │   └── ChatHistory.js                   # Conversation log with intents
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── departmentController.js
│   │   ├── cutoffController.js
│   │   ├── feesController.js
│   │   ├── hostelController.js
│   │   ├── transportController.js
│   │   ├── placementController.js
│   │   ├── chatbotController.js
│   │   └── admissionController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── cutoffRoutes.js
│   │   ├── feeRoutes.js
│   │   ├── hostelRoutes.js
│   │   ├── transportRoutes.js
│   │   ├── placementRoutes.js
│   │   ├── chatbotRoutes.js
│   │   └── admissionRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js                # JWT token parser
│   │   ├── adminMiddleware.js               # Admin role checker
│   │   └── errorMiddleware.js               # 404 & 500 JSON error handlers
│   │
│   ├── services/
│   │   └── chatbotService.js                # Natural language intent engine
│   │
│   └── seed/
│       └── seedDatabase.js                  # Production sample data seeder
│
├── .env                                     # Environment variables
├── package.json                             # Dependencies & startup scripts
├── README.md                                # Comprehensive documentation
├── PROJECT_REVIEW_GUIDE.md                  # Viva preparation & concept map
└── .gitignore
```

---

## 8. AngularJS Concepts Breakdown

Every major AngularJS concept is clearly isolated and demonstrated:

| AngularJS Concept | Implementation File | Demonstration Purpose |
|---|---|---|
| **Controllers** | `client/app/controllers/*.js` (12 controllers) | ViewModel logic, event delegation, and scope state |
| **Services** | `client/app/services/*.js` (10 services) | Business logic and REST communication encapsulation |
| **Directives** | `client/app/directives/*.js` (6 directives) | Reusable UI components (`<department-card>`, `<cutoff-badge>`) |
| **Filters** | `client/app/filters/*.js` (5 filters) | Output formatting (`currencyFormat`, `cutoffFormat`, `searchFilter`) |
| **Routing** | `client/app/routes.js` | SPA view routing using `$routeProvider` and security guards |
| **$http** | `client/app/services/apiService.js` | RESTful HTTP requests with headers and token handling |
| **$q** | `apiService.js`, `dashboardController.js` | Promise chaining, deferred results, and `$q.all` concurrency |
| **Dependency Injection** | All controllers, services, directives | Minification-safe array notation injection `['$http', function($http){...}]` |
| **Form Validation** | `login.html`, `register.html` | Built-in `$invalid`, `$dirty`, `$error`, `required`, `minlength` |
| **Two-Way Binding** | `fees.html`, `cutoffs.html` | Interactive inputs via `ng-model` recomputing live estimations |
| **ng-repeat** | All view templates | Rendering collections with track by, limitTo, and custom filter pipes |
| **ng-if** | `dashboard.html`, `cutoffs.html` | Conditional DOM creation and destruction |
| **ng-show / ng-hide** | `chatbotDirective.js` | Toggle visibility of animated elements |
| **ng-click / ng-change** | Throughout views | Triggering controller methods on user interaction |

---

## 9. AI Chatbot Architecture

The AI Chatbot is designed as a modular knowledge engine that can easily integrate Gemini API / OpenAI API.

### Workflow:
1. **User Query Input:** The user asks a question via the floating widget or dedicated `/chatbot` page.
2. **Intent Classification:** `chatbotService.js` classifies the query into intents (`CUTOFF_INQUIRY`, `FEES_INQUIRY`, `HOSTEL_INQUIRY`, `TRANSPORT_INQUIRY`, `PLACEMENT_INQUIRY`, `ADMISSION_INQUIRY`, `DEPARTMENT_INQUIRY`, `COLLEGE_INQUIRY`).
3. **MongoDB Knowledge Retrieval:** The service performs dynamic keyword and entity lookup against relevant Mongoose models (`Cutoff`, `FeeStructure`, `Hostel`, `Department`, `Placement`, `Admission`).
4. **Answer Generation:** A structured factual response is crafted with bullet points, fees, numbers, and recommended follow-up questions.
5. **Persistence:** The query, response, and identified intent are saved into the `ChatHistory` collection.
6. **Future LLM Adapter:** The service contains a clean extension point (`processWithLLM`) allowing seamless connection to Google Gemini API with one environment variable (`GEMINI_API_KEY`).

---

## 10. Database Schema (MongoDB & Mongoose)

* **User:** `name`, `email`, `password` (bcrypt hash), `role` (`Student` | `Prospective Student` | `Admin`), `phone`, `counsellingRank`, `category`, `favorites`, `checklist`.
* **College:** `name`, `code`, `tagline`, `description`, `location`, `establishedYear`, `accreditation`, `ranking`, `facilities`.
* **Department:** `departmentName`, `departmentCode`, `description`, `degree`, `duration`, `intake`, `eligibility`, `facilities`, `careerOptions`, `hod`, `labs`.
* **Cutoff:** `departmentId` (ref), `academicYear` (2023-2026), `category` (OC, BC, BCM, MBC, SC, ST), `quota`, `openingRank`, `closingRank`, `closingCutoff`, `counsellingRound`.
* **FeeStructure:** `departmentId` (ref), `academicYear`, `tuitionFee`, `hostelFee`, `transportFee`, `examinationFee`, `otherFees`, `totalAnnualFee`, `scholarshipDetails`.
* **Hostel:** `hostelName`, `type` (`Boys` | `Girls`), `capacity`, `availableBeds`, `roomTypes` (array of occupancy, fee, isAc), `messDetails`, `rules`, `contact`.
* **Transport:** `routeName`, `routeNumber`, `startingPoint`, `stops` (stopName, time, landmark), `timing`, `distance`, `fee`, `driverContact`.
* **Placement:** `companyName`, `industry`, `package`, `minPackageLPA`, `maxPackageLPA`, `jobRole`, `hiringYear`, `department`, `tier`, `offersCount`.
* **Admission:** `admissionYear`, `eligibility`, `counsellingProcess` (steps), `requiredDocuments` (name, mandatory), `importantDates`, `helpline`.
* **ChatHistory:** `userId`, `sessionId`, `question`, `answer`, `intent`, `suggestedFollowUps`, `timestamp`.

---

## 11. REST API Documentation

### Authentication & Profile (`/api/auth`)
* `POST /api/auth/register` - Create account (Student / Prospective / Admin)
* `POST /api/auth/login` - Authenticate & obtain JWT
* `GET /api/auth/me` - Get current authenticated user profile (Private)
* `PUT /api/auth/profile` - Update rank and category (Private)
* `POST /api/auth/favorite` - Bookmark department, cutoff, or company (Private)
* `PUT /api/auth/checklist` - Sync admission document checklist (Private)

### Departments (`/api/departments`)
* `GET /api/departments` - List all departments (supports `search`, `degree`, `sort`)
* `GET /api/departments/:id` - Get department details with related cutoffs and fees
* `GET /api/departments/stats/summary` - Aggregate department stats
* `POST /api/departments` - Create department (Admin)
* `PUT /api/departments/:id` - Update department (Admin)
* `DELETE /api/departments/:id` - Delete department (Admin)

### Cutoffs & Prediction (`/api/cutoffs`)
* `GET /api/cutoffs` - Filter cutoffs by year, category, quota, department
* `POST /api/cutoffs/predict` - Admission likelihood predictor (*Can I Get This Branch?*)
* `GET /api/cutoffs/analytics/trends` - Historical closing cutoff trajectories (2023-2026)
* `POST /api/cutoffs` - Add cutoff record (Admin)
* `DELETE /api/cutoffs/:id` - Delete cutoff record (Admin)

### Fees & Cost Calculator (`/api/fees`)
* `GET /api/fees` - List all department fee structures
* `POST /api/fees/calculate` - Dynamic 4-year education cost calculator
* `POST /api/fees/compare` - Compare multiple departments fees

### Hostels (`/api/hostel`)
* `GET /api/hostel` - Get boys and girls hostel specifications and room tariffs
* `POST /api/hostel` - Add hostel block (Admin)

### Transport (`/api/transport`)
* `GET /api/transport` - List bus routes (search by route or boarding stop)
* `POST /api/transport` - Create bus route (Admin)
* `DELETE /api/transport/:routeId` - Delete bus route (Admin)

### Placements (`/api/placements`)
* `GET /api/placements` - List recruiters with industry and tier filters
* `GET /api/placements/stats/summary` - Highest package, average, total offers
* `POST /api/placements` - Add placement partner (Admin)
* `DELETE /api/placements/:id` - Delete placement record (Admin)

### Chatbot (`/api/chatbot`)
* `POST /api/chatbot/ask` - Ask question to knowledge base
* `GET /api/chatbot/history` - Retrieve session chat history
* `DELETE /api/chatbot/history` - Clear conversation history

---

## 12. Setup & Installation Guide

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* **MongoDB** (Local instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### Step 1: Clone or Navigate to the Project
```bash
cd d:/WEB/campusconnect-ai
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Verify or edit `.env` in the root folder:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect_db
JWT_SECRET=campusconnect_super_secret_jwt_key_2026_secure
NODE_ENV=development
```

### Step 4: Seed the Database
Populate realistic academic departments, 4 years of cutoff data, hostels, bus routes, and sample accounts:
```bash
npm run seed
```

### Step 5: Start the Application
```bash
npm start
```
* The Express server serves both the **REST APIs** (`/api/*`) and the **AngularJS SPA frontend** (`/`) from a unified port.
* Open your browser and navigate to:
  **`http://localhost:5000`**

---

## 13. Test Credentials for Demo & Viva

| Role | Email | Password | Pre-loaded Data |
|---|---|---|---|
| **System Administrator** | `admin@campusconnect.edu` | `Admin@123` | Full access to Admin Console CRUD |
| **Enrolled Student** | `student@campusconnect.edu` | `Student@123` | Rank #3850, Category OC, Saved favorites |
| **Prospective Student** | `prospect@campusconnect.edu` | `Prospect@123` | Rank #7800, Category BC, Checklist items |

*(The login screen also provides quick-click buttons to auto-populate any of these test credentials!)*

---

## 14. Future Enhancements

1. **Direct LLM Fine-Tuning:** Toggle Gemini 1.5 Pro / GPT-4 via the existing adapter for open-ended counseling conversations.
2. **Online Seat Acceptance Fee Gateway:** Integrate Razorpay / Stripe for seat booking deposits.
3. **Bus GPS Live Telemetry:** Connect Socket.io for live vehicle coordinates on interactive Leaflet maps.
4. **Alumni Mentorship Network:** Real-time chat connecting alumni in Google, Amazon, and Zoho with prospective students.
