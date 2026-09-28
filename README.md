# CampusLaunch

> Discover. Match. Track. Act.

CampusLaunch is a student-focused opportunity intelligence platform that brings internships, hackathons, scholarships, workshops, certifications and other career opportunities into one organized workflow.

Instead of only listing opportunities, CampusLaunch helps students discover relevant opportunities, track applications, understand deadlines and receive timely reminders.

---

## Why CampusLaunch?

Students often discover opportunities across many different platforms, but the difficult part is keeping track of:

- Which opportunities are relevant to their profile
- Which opportunities they have already saved or applied to
- Upcoming deadlines
- Application progress
- Important reminders

CampusLaunch brings these activities into one student-centric platform.

---

## Core Features

### Student Portal

- Student registration and secure login
- Personalized student profile
- College, course, year, skills and interests
- Opportunity discovery
- Personalized opportunity recommendations
- Save opportunities
- Track applications
- Application status management
- Deadline intelligence
- Notification center
- Email deadline reminders
- WhatsApp reminder integration
- Resume upload and management

### Admin Console

- Secure admin authentication
- Platform overview and analytics
- Opportunity management
- Create and edit opportunities
- Opportunity verification
- Delete opportunities
- Student application monitoring
- Student resume access
- Himalayas job synchronization
- External opportunity source tracking

The admin dashboard includes a dedicated Himalayas synchronization action that fetches external opportunities into the platform. :contentReference[oaicite:0]{index=0}

---

## Opportunity Workflow

```text
Discover
   ↓
Match
   ↓
Save / Track
   ↓
Apply
   ↓
Monitor Status
   ↓
Receive Deadline Reminder
   ↓
Act Before Deadline

Personalization

CampusLaunch uses student profile information such as:

Skills
Interests
Course
Academic year

to identify opportunities that may be relevant to the student.

Deadline Intelligence

CampusLaunch monitors upcoming opportunity deadlines and generates reminders based on remaining time.

Example reminder windows:

7 days remaining → Reminder
3 days remaining → Reminder
1 day remaining → Urgent reminder

Notifications can be surfaced inside the student dashboard and delivered through configured communication channels.

Technology Stack
Frontend
React
Vite
JavaScript
Axios
React Router
Lucide React
CSS
Backend
Node.js
Express.js
REST APIs
JWT Authentication
bcrypt
Zod
Multer
Database
MongoDB Atlas
Mongoose
Integrations
Himalayas Jobs API
Resend
WhatsApp Business Cloud API
Deployment
Vercel — Frontend
Render — Backend
MongoDB Atlas — Database
System Architecture
                    ┌──────────────────────┐
                    │      Students       │
                    │  Web Browser / UI   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Vercel        │
                    │   React + Vite      │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │       Render        │
                    │ Node + Express API  │
                    └───────┬──────┬───────┘
                            │      │
              ┌─────────────┘      └──────────────┐
              ▼                                   ▼
     ┌─────────────────┐                  ┌─────────────────┐
     │ MongoDB Atlas   │                  │ External APIs   │
     │ Users           │                  │ Himalayas       │
     │ Opportunities   │                  │ Resend          │
     │ Applications    │                  │ WhatsApp Cloud  │
     │ Saved Items     │                  └─────────────────┘
     │ Notifications   │
     └─────────────────┘
Project Structure
CampusLaunch/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
Local Development
1. Clone the repository
git clone https://github.com/Pranav-Techie/CampusLaunch.git
cd CampusLaunch
2. Install frontend dependencies
cd frontend
npm install
3. Install backend dependencies
cd ../backend
npm install
4. Configure backend environment variables

Create:

backend/.env

Example:

PORT=5001

MONGO_URI=mongodb+srv://YOUR_DATABASE_USER:YOUR_DATABASE_PASSWORD@YOUR_CLUSTER.mongodb.net/campuslaunch

JWT_SECRET=YOUR_JWT_SECRET

RESEND_API_KEY=YOUR_RESEND_API_KEY
EMAIL_FROM=YOUR_EMAIL

WHATSAPP_ACCESS_TOKEN=YOUR_WHATSAPP_ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID=YOUR_WHATSAPP_PHONE_NUMBER_ID

Never commit .env to GitHub.

5. Start backend
cd backend
npm run dev
6. Start frontend

In another terminal:

cd frontend
npm run dev
Authentication

CampusLaunch uses:

JWT
+
bcrypt password hashing
+
protected API routes
+
role-based authorization

Students and administrators use separate application flows, while the backend determines the authenticated user's role.

Data Model

Main entities include:

User
 ├── Profile
 ├── Skills
 ├── Interests
 └── Resume

Opportunity
 ├── Organization
 ├── Type
 ├── Skills
 ├── Deadline
 └── Source

Application
 ├── Student
 ├── Opportunity
 ├── Status
 └── Applied Date

Saved
 ├── Student
 └── Opportunity

Notification
 ├── Student
 ├── Opportunity
 └── Reminder Type

The admin interface currently loads student applications through the /applications/admin/all endpoint and displays student and opportunity information for each application.

External Opportunity Data

CampusLaunch can synchronize opportunities from Himalayas through its admin synchronization workflow.

The admin dashboard exposes:

Sync Himalayas

which calls the backend synchronization endpoint and then refreshes the admin opportunity data.

Himalayas opportunities are displayed with their external source attribution.

Deployment
Frontend — Vercel

Configure:

Root Directory: frontend
Build Command: npm run build
Output Directory: dist

Frontend environment variable:

VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
Backend — Render

Configure:

Root Directory: backend
Build Command: npm install
Start Command: npm start

Set production environment variables in Render.

Database — MongoDB Atlas

Use the Atlas connection string as:

MONGO_URI=mongodb+srv://...

The deployed backend connects directly to MongoDB Atlas. The MongoDB Atlas website does not need to remain open.

Security Notes
.env is excluded from Git
Passwords are hashed before storage
JWT authentication protects private routes
Admin routes require administrator authorization
API credentials must be stored as environment variables
Production secrets should never be committed to the repository
Future Roadmap
Multi-source opportunity aggregation
Automated scheduled opportunity synchronization
More advanced recommendation scoring
Calendar integration
Push notifications
Expanded WhatsApp notification workflows
Opportunity quality and duplicate detection
Student career analytics
Project Vision

CampusLaunch aims to turn scattered opportunity discovery into a structured student workflow:

Find the right opportunity
        ↓
Understand why it fits
        ↓
Track your progress
        ↓
Remember the deadline
        ↓
Take action
Author

Pranav Jha

GitHub: @Pranav-Techie

License

This project is developed as a student/hackathon project.


### 3. Add it

From:

```bash
cd ~/CampusLaunch
