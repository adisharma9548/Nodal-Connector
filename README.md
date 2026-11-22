# NodalConnector

NodalConnector is a multi-stakeholder collaboration and career platform designed to connect students, job seekers, academic faculty, and industry employers in India. The application provides dedicated role-based portals for discovering internships and jobs, verifying institutional academic credentials, conducting skill assessments, and coordinating faculty-student research initiatives.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS for styling
- Lucide React for UI iconography
- Axios for HTTP communication
- Socket.IO client for real-time notifications

### Backend
- Node.js and Express with TypeScript
- MongoDB Atlas with Mongoose ODM
- Socket.IO for WebSocket communication
- JSON Web Tokens (JWT) and Bcrypt for authentication and password hashing
- Helmet and Express Rate Limit for HTTP header security and request throttling
- Multer with magic-byte validation for file uploads

## Key Features

- Role-based workspaces: Separate interfaces and navigation for Student, Job Seeker, Faculty (Academician), Industry (Employer), and Administrator accounts.
- Authentication and security: Email and password registration, optional two-factor email OTP verification, password reset workflows, and token expiration handling.
- Opportunity board: Job and internship postings with search, filtering by stipend/salary and location, and an application pipeline for candidate tracking.
- Institutional discovery: College and university profile directory with domain resolution and claim verification workflows.
- Skill assessments: Timed multiple-choice quizzes for students to test technical domain knowledge and track scores over time.
- Direct messaging and notifications: Real-time event notifications and message delivery over WebSocket connections.
- In-progress / Planned: External OAuth providers (Google and LinkedIn), native WebRTC video conferencing (currently links out to external meeting URLs), and automated external document verification APIs.

## Architecture

The project is structured as a decoupled client-server architecture:

```
Nodal-Connector/
├── client/          # Single-page application built with React and Vite
├── server/          # REST API and WebSocket server built with Express and TypeScript
├── package.json     # Convenience scripts to launch development servers
├── .gitignore
└── README.md
```

Communication between the client and server occurs primarily over RESTful JSON HTTP endpoints, with Socket.IO providing bidirectional communication for real-time notifications. Authentication state is managed client-side using JWTs passed via the `Authorization: Bearer <token>` header, with database sessions and role authorizations validated on each protected endpoint.

## Local Setup

### Prerequisites
- Node.js (v20.x or v24.x recommended)
- npm (v10.x or higher)
- A running MongoDB instance (local or MongoDB Atlas connection URI)

### 1. Clone the repository
```bash
git clone https://github.com/adisharma9548/Nodal-Connector.git
cd Nodal-Connector
```

### 2. Install dependencies
Install dependencies separately in both the client and server directories:

```bash
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Configure environment variables
Copy the example environment files and configure your local settings:

**Server (`server/.env`):**
```bash
cp server/.env.example server/.env
```
Key server variables:
- `PORT`: Server port (default: `5000`)
- `NODE_ENV`: `development` or `production`
- `MONGODB_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/nodalconnector` or Atlas URI)
- `JWT_SECRET`: Secret key used for signing JSON Web Tokens
- `CLIENT_URL`: Frontend origin for CORS policy (default: `http://localhost:5173`)
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` or `RESEND_API_KEY`: Required if testing email verification and OTPs

**Client (`client/.env`):**
```bash
cp client/.env.example client/.env
```
Key client variables:
- `VITE_API_URL`: Backend API base URL (default: `http://localhost:5000/api`)

### 4. Run the development servers
From the root directory, start the backend and frontend concurrently or in separate terminal windows:

```bash
# Terminal 1 - Start the backend server (runs on port 5000)
npm run dev:server

# Terminal 2 - Start the frontend client (runs on port 5173)
npm run dev:client
```

Open `http://localhost:5173` in your browser to access the application.

## API Overview

The backend REST API is mounted under `/api` with the following primary endpoint groups:

- `/api/auth`: User registration, login, 2FA OTP verification, password reset, and profile updates.
- `/api/jobs` & `/api/internships`: Listings, creation, filtering, and candidate application submissions.
- `/api/applications`: Recruiter and applicant status tracking (applied, shortlisted, rejected).
- `/api/college` & `/api/institution`: Search directory, institution profiles, and institutional claim verification.
- `/api/academician`: Faculty opportunities, research collaborations, and mentorship requests.
- `/api/skills`: Skill assessments, question retrieval, and score submission.
- `/api/notifications`: User notification feeds and unread count counters.
- `/api/admin`: Platform administration, claim approvals, and system-wide statistics.
- `/api/health`: Basic service and database connectivity check.

## License

This project is licensed under the MIT License.
