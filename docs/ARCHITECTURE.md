# System Architecture & Workflow Specifications: Nodal-Connector

---

## 1. High-Level System Topology

```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer (React / Vite)"]
        Browser["User Browser (Desktop / Mobile)"]
        PublicRoutes["Public Pages (Landing, Discovery, Auth)"]
        PrivateRoutes["Role Dashboards (Student, Recruiter, Admin)"]
        Browser --> PublicRoutes
        Browser --> PrivateRoutes
    end

    subgraph CDNLayer ["Edge & CDN Layer (Vercel)"]
        VercelEdge["Vercel Edge Network / Reverse Proxy"]
        StaticAssets["Static Bundle Assets (JS, CSS, HTML)"]
        PublicRoutes --> VercelEdge
        VercelEdge --> StaticAssets
    end

    subgraph BackendLayer ["Backend API Layer (Express / Node.js)"]
        APIGateway["Express API Router (/api)"]
        SecurityMiddleware["Security Guards (Helmet, CSP, Rate Limiters)"]
        AuthMiddleware["JWT & Role Authorization Guard"]
        Controllers["Domain Controllers (Auth, Resume, Assessment)"]

        PrivateRoutes -->|HTTPS / WSS| SecurityMiddleware
        SecurityMiddleware --> AuthMiddleware
        AuthMiddleware --> APIGateway
        APIGateway --> Controllers
    end

    subgraph DataAndCloudLayer ["Cloud Infrastructure & Storage"]
        AtlasDB[(MongoDB Atlas - Cluster sih26044)]
        CloudinaryBucket[("Cloudinary Private Media Storage")]
        GeminiAI["Google Gemini Developer API"]
        GmailSMTP["Gmail SMTP Outbound Gateway"]

        Controllers -->|Mongoose Queries| AtlasDB
        Controllers -->|Direct Memory Stream / Signed URLs| CloudinaryBucket
        Controllers -->|Skill Extraction & Roadmaps| GeminiAI
        Controllers -->|One-Time Passwords| GmailSMTP
    end
```

---

## 2. Authentication & Two-Factor OTP Security Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Student / Recruiter / Admin)
    participant Client as React Client (Zustand)
    participant API as Express API (/api/auth)
    participant DB as MongoDB Atlas (users & otpverifications)
    participant Mail as Gmail SMTP Gateway

    User->>Client: Enters Email & Password
    Client->>API: POST /api/auth/login { email, password }
    API->>DB: Query User by Email
    DB-->>API: Returns User Document (with bcrypt hash)
    API->>API: Verify Password with bcrypt.compare()
    alt Password Invalid
        API->>DB: Increment failedLoginAttempts
        API-->>Client: 401 Unauthorized (Triggers lockout if >= 5 attempts)
    else Password Valid
        alt User Requires 2FA
            API->>API: Generate 6-digit cryptographic OTP & compute SHA-256 hash
            API->>DB: Store OTP hash (10-minute expiry)
            API->>Mail: Dispatch verification email to user
            API-->>Client: 200 OK { requires2FA: true, email }
            User->>Client: Enters 6-digit OTP code
            Client->>API: POST /api/auth/verify-2fa { email, otp }
            API->>DB: Verify OTP hash & check expiration
            API->>DB: Delete verified OTP record
        end
        API->>API: Generate JWT token (24h lifespan, signed with JWT_SECRET)
        API-->>Client: 200 OK { token, user profile }
        Client->>Client: Persist token in secure session state
    end
```

---

## 3. Resume Upload & BOLA-Protected Retrieval Flow

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as Candidate
    actor Recruiter as Recruiter / Employer
    participant Client as React Client
    participant API as Express API (/api/resumes)
    participant Cloudinary as Cloudinary Private Storage
    participant DB as MongoDB Atlas

    Note over Candidate,Cloudinary: 1. Secure Upload Phase
    Candidate->>Client: Selects PDF Resume
    Client->>API: POST /api/resumes/upload (multipart/form-data)
    API->>API: Validate file size (<= 5MB) via Multer memoryStorage
    API->>API: Inspect first 16 magic bytes (verifies %PDF header)
    API->>Cloudinary: Stream buffer directly (type: 'authenticated')
    Cloudinary-->>API: Returns { public_id, secure_url }
    API->>DB: Save Resume Record { userId, cloudinaryPublicId }
    API-->>Client: 200 OK { success: true }

    Note over Recruiter,Cloudinary: 2. BOLA-Protected Retrieval Phase
    Recruiter->>Client: Requests candidate resume for job posting
    Client->>API: GET /api/resumes/:resumeId/download
    API->>DB: Check Candidate Application for Recruiter's Job
    alt Recruiter Has No Application for this Candidate
        API-->>Client: 403 Forbidden (BOLA Blocked)
    else Verified Applicant
        API->>Cloudinary: Generate HMAC signed download URL (5-minute expiry)
        Cloudinary-->>API: Returns expiring signed URL
        API-->>Client: 200 OK { downloadUrl }
        Client->>Candidate: Secure PDF rendered directly to Recruiter
    end
```

---

## 4. Assessment Engine & Competency Radar Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student / Scholar
    participant Client as React Client (Assessment Workspace)
    participant API as Express API (/api/assessments)
    participant DB as MongoDB Atlas
    participant AI as Google Gemini AI Engine

    Student->>Client: Starts Diagnostic Skill Assessment
    Client->>API: POST /api/assessments/start { assessmentId }
    API->>DB: Create AssessmentAttempt with server-anchored startedAt timestamp
    API-->>Client: Returns Question Set (excluding answer keys)
    
    Student->>Client: Answers Questions & Clicks Submit
    Client->>API: POST /api/assessments/submit { attemptId, answers }
    API->>DB: Retrieve startedAt timestamp
    API->>API: Enforce Timer Guard (rejects future timestamps or duration > 3 hours)
    API->>API: Calculate verified competency score
    API->>DB: Persist Attempt Score & Update SkillProfile
    
    opt Personalized AI Recommendations
        API->>AI: Send verified skill gaps
        AI-->>API: Return structured learning modules & milestones
        API->>DB: Cache LearningRoadmap for Student
    end

    API-->>Client: 200 OK { score, skillRadarMetrics, recommendations }
    Client->>Student: Renders Interactive Skill Radar & Verified Credentials
```
