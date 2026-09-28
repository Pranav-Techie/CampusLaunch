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

The admin dashboard includes a dedicated **Sync Himalayas** action that fetches external opportunities into the platform.

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
```

---

## Personalization

CampusLaunch uses student profile information such as:

- Skills
- Interests
- Course
- Academic year

to identify opportunities that may be relevant to the student.

---

## Deadline Intelligence

CampusLaunch monitors upcoming opportunity deadlines and generates reminders based on remaining time.

Example reminder windows:

| Time remaining | Reminder type    |
| -------------- | ---------------- |
| 7 days         | Reminder         |
| 3 days         | Reminder         |
| 1 day          | Urgent reminder  |

Notifications can be surfaced inside the student dashboard and delivered through configured communication channels.

---

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- Axios
- React Router
- Lucide React
- CSS

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt
- Zod
- Multer

**Database**
- MongoDB Atlas
- Mongoose

**Integrations**
- Himalayas Jobs API
- Resend
- WhatsApp Business Cloud API

**Deployment**
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## System Architecture

```text
                    ┌──────────────────────┐
                    │       Students       │
                    │   Web Browser / UI   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │        Vercel        │
                    │     React + Vite     │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │        Render        │
                    │  Node + Express API  │
                    └───────┬──────┬───────┘
                            │      │
              ┌─────────────┘      └──────────────┐
              ▼                                   ▼
     ┌─────────────────┐                  ┌─────────────────┐
     │  MongoDB Atlas  │                  │  External APIs  │
     │  Users          │                  │  Himalayas      │
     │  Opportunities  │                  │  Resend         │
     │  Applications   │                  │  WhatsApp Cloud │
     │  Saved Items    │                  └─────────────────┘
     │  Notifications  │
     └─────────────────┘
```

---

## Project Structure

```text
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
│   └── .env            (local only, never committed)
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
```

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Pranav-Techie/CampusLaunch.git
cd CampusLaunch
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Configure backend environment variables

Create a file named `backend/.env` and fill in your own values:

```env
PORT=5001

# MongoDB Atlas connection string (copy it from Atlas: Connect > Drivers)
MONGO_URI=<your-mongodb-atlas-connection-string>

JWT_SECRET=<your-jwt-secret>

RESEND_API_KEY=<your-resend-api-key>
EMAIL_FROM=<your-sender-email>

WHATSAPP_ACCESS_TOKEN=<your-whatsapp-access-token>
WHATSAPP_PHONE_NUMBER_ID=<your-whatsapp-phone-number-id>
```

> **Never commit `.env` to GitHub.** Make sure `.env` is listed in `.gitignore`.

### 5. Start the backend

```bash
cd backend
npm run dev
```

### 6. Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

---

## Authentication

CampusLaunch uses:

- JWT authentication
- bcrypt password hashing
- Protected API routes
- Role-based authorization

Students and administrators use separate application flows, while the backend determines the authenticated user's role.

---

## Data Model

Main entities include:

```text
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
```

The admin interface loads student applications through the `/applications/admin/all` endpoint and displays student and opportunity information for each application.

---

## External Opportunity Data

CampusLaunch can synchronize opportunities from Himalayas through its admin synchronization workflow.

The admin dashboard exposes a **Sync Himalayas** button, which calls the backend synchronization endpoint and then refreshes the admin opportunity data.

Himalayas opportunities are displayed with their external source attribution.

---

## Deployment

### Frontend — Vercel

```text
Root Directory:   frontend
Build Command:    npm run build
Output Directory: dist
```

Frontend environment variable:

```env
VITE_API_URL=https://<your-backend>.onrender.com/api
```

### Backend — Render

```text
Root Directory: backend
Build Command:  npm install
Start Command:  npm start
```

Set all production environment variables in the Render dashboard.

### Database — MongoDB Atlas

Use your Atlas connection string as the `MONGO_URI` environment variable in Render.

The deployed backend connects directly to MongoDB Atlas, so the Atlas website does not need to remain open.

---

## Security Notes

- `.env` is excluded from Git
- Passwords are hashed before storage
- JWT authentication protects private routes
- Admin routes require administrator authorization
- API credentials are stored only as environment variables
- Production secrets are never committed to the repository
- Documentation uses `<placeholder>` values instead of connection-string-shaped examples, so secret scanners are not triggered

---

## Future Roadmap

- Multi-source opportunity aggregation
- Automated scheduled opportunity synchronization
- More advanced recommendation scoring
- Calendar integration
- Push notifications
- Expanded WhatsApp notification workflows
- Opportunity quality and duplicate detection
- Student career analytics

---

## Project Vision

CampusLaunch aims to turn scattered opportunity discovery into a structured student workflow:

```text
Find the right opportunity
        ↓
Understand why it fits
        ↓
Track your progress
        ↓
Remember the deadline
        ↓
Take action
```

---

## Author

**Pranav Jha**

GitHub: [@Pranav-Techie](https://github.com/Pranav-Techie)

---

## License

This project is developed as a student/hackathon project.
