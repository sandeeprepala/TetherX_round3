# 🏥 Patient Query & Appointment Interface

> A robust backend system that streamlines healthcare communication — enabling patients to submit medical queries, request appointments by specialization, and ensuring doctors never face scheduling conflicts.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [System Logic](#-system-logic)
- [Tech Stack](#-tech-stack)
- [Architecture & Folder Structure](#-architecture--folder-structure)
- [Database Design](#-database-design)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [Testing with Postman](#-testing-with-postman)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Project Overview

The **Patient Query & Appointment Interface** is a backend API system designed to modernize healthcare appointment management. It allows patients to submit structured medical queries and request appointments with doctors filtered by specialization. Doctors receive only conflict-free appointment requests, and the system intelligently prevents overlapping bookings.

This project targets the inefficiencies of manual appointment booking in hospitals and clinics — reducing administrative overhead and improving the patient-doctor communication pipeline.

---

## 🚨 Problem Statement

Hospitals often suffer from:

- 📋 **Manual appointment booking** — prone to errors and double-bookings
- 🔀 **Poor triage** — no structured intake of patient symptoms or queries
- 📡 **Inefficient communication** — patients struggle to reach the right specialist

### ✅ How This System Solves It

- Patients submit **structured medical queries** with appointment requests
- Requests are **automatically routed** to doctors of the right specialization
- A built-in **overlap detection engine** prevents scheduling conflicts
- Separate **dashboards** for patients and doctors provide clear visibility

---

## ✨ Features

### 👤 Patient Features
| Feature | Description |
|--------|-------------|
| 🔐 Secure Auth | Register and login with hashed passwords and JWT tokens |
| 📝 Submit Query | Submit a medical query alongside an appointment request |
| 🏥 Request by Specialization | Send appointment requests to **all** doctors of a given specialization |
| 👨‍⚕️ Request Specific Doctor | Target a specific doctor for an appointment |
| 📅 Upcoming Appointments | View all scheduled upcoming appointments |
| 🕓 Past Appointments | Access complete appointment history |

### 🩺 Doctor Features
| Feature | Description |
|--------|-------------|
| 🔐 Secure Auth | Register and login securely |
| 📬 View Requests | See all pending appointment requests from patients |
| ✅ Accept Appointments | Accept a request to confirm the appointment |
| 🚫 Conflict Prevention | System automatically blocks requests that overlap existing appointments |
| 📅 Upcoming Appointments | View all confirmed upcoming appointments |

---

## ⚙️ System Logic

### Appointment Request Flow

```
Patient submits appointment request
        │
        ▼
System finds doctors matching specialization
        │
        ▼
For each doctor → Check for overlapping accepted appointments
        │
        ├── Overlap detected? → Doctor does NOT receive the request
        │
        └── No overlap? → Request is delivered to doctor
                              │
                              ▼
                     Doctor accepts request
                              │
                              ▼
                     Appointment is confirmed ✅
```

### 🔁 Overlap Detection Logic

An appointment is considered **overlapping** if the following condition is true:

```
existing.startDate <= newEndDate
AND
existing.endDate >= newStartDate
```

This ensures no two accepted appointments for the same doctor share any time window.

**Example:**

```
Doctor has: 10:00 AM → 11:00 AM (accepted)

New request: 10:30 AM → 11:30 AM
→ 10:00 <= 11:30 ✅ AND 11:00 >= 10:30 ✅
→ OVERLAP DETECTED — doctor will NOT receive this request

New request: 11:00 AM → 12:00 PM
→ 10:00 <= 12:00 ✅ AND 11:00 >= 11:00 ✅
→ OVERLAP DETECTED (edge case — back-to-back requires strict inequality)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| API Testing | Postman |

---

## 🗂️ Architecture & Folder Structure

```
backend/
│
├── config/
│   └── db.js                  # MongoDB connection setup
│
├── controllers/
│   ├── authController.js      # Registration & login logic
│   ├── patientController.js   # Patient request & appointment logic
│   └── doctorController.js    # Doctor accept & appointment logic
│
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
│
├── models/
│   ├── Patient.js             # Patient schema
│   ├── Doctor.js              # Doctor schema
│   └── AppointmentRequest.js  # Appointment request schema
│
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   ├── patientRoutes.js       # Patient endpoints
│   └── doctorRoutes.js        # Doctor endpoints
│
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── index.js                   # App entry point
```

### 📁 Folder Responsibilities

- **`config/`** — Database connection configuration and environment bootstrapping
- **`controllers/`** — Core business logic; handles request processing and response formatting
- **`middleware/`** — JWT authentication guard applied to protected routes
- **`models/`** — Mongoose schemas defining the shape of MongoDB documents
- **`routes/`** — Express routers mapping HTTP methods and paths to controller functions
- **`index.js`** — Entry point; initializes Express, connects to DB, and registers routes

---

## 🗃️ Database Design

### `patients` Collection

```js
{
  _id: ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },       // bcrypt hashed
  phone: { type: String },
  dateOfBirth: { type: Date },
  createdAt: { type: Date, default: Date.now }
}
```

### `doctors` Collection

```js
{
  _id: ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },       // bcrypt hashed
  specialization: { type: String, required: true }, // e.g. "Cardiology"
  hospital: { type: String },
  availableFrom: { type: String },                  // e.g. "09:00"
  availableTo: { type: String },                    // e.g. "17:00"
  createdAt: { type: Date, default: Date.now }
}
```

### `appointment_requests` Collection

```js
{
  _id: ObjectId,
  patientId: { type: ObjectId, ref: "Patient", required: true },
  doctorId: { type: ObjectId, ref: "Doctor", required: true },
  query: { type: String, required: true },          // Patient's medical query
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/patient/register` | Register a new patient account |
| `POST` | `/auth/doctor/register` | Register a new doctor account |
| `POST` | `/auth/login` | Login for both patients and doctors |

---

### 👤 Patient Routes

> All patient routes require a valid JWT in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/patient/request/all` | Send appointment request to **all** doctors of a specialization |
| `POST` | `/patient/request/doctor` | Send appointment request to a **specific** doctor |
| `GET` | `/patient/appointments/upcoming/:patientId` | Get all upcoming appointments for a patient |
| `GET` | `/patient/appointments/past/:patientId` | Get past appointment history for a patient |

---

### 🩺 Doctor Routes

> All doctor routes require a valid JWT in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/doctor/accept/:requestId` | Doctor accepts a pending appointment request |
| `GET` | `/doctor/appointments/upcoming/:doctorId` | Get all upcoming confirmed appointments for a doctor |

---

## 🔑 Authentication

This system uses **JWT (JSON Web Tokens)** for stateless authentication.

### Flow

```
1. User registers → password hashed with bcryptjs → stored in DB
2. User logs in → credentials verified → JWT issued (expires in 7d)
3. Protected routes → JWT extracted from Authorization header → verified
4. Invalid/expired token → 401 Unauthorized response
```

### Token Usage

Include the token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🚀 Installation Guide

### Prerequisites

- Node.js `v18+`
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/your-username/patient-query-appointment-interface.git
cd patient-query-appointment-interface/backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
# Then edit .env with your values (see section below)
```

**4. Start the server**

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` root directory:

```env
# Server
PORT=5000

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/appointmentDB

# JWT Secret Key (use a long, random string)
JWT_SECRET=your_super_secret_jwt_key_here
```

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port the Express server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string (local or Atlas) | `mongodb://localhost:27017/appointmentDB` |
| `JWT_SECRET` | Secret key for signing/verifying JWTs | `s3cr3t_k3y_xyz` |

> ⚠️ **Never commit your `.env` file to version control.** Add it to `.gitignore`.

---

## 🧪 Testing with Postman

### Setup

1. Download and open [Postman](https://www.postman.com/)
2. Set the base URL as `http://localhost:5000`
3. For protected routes, add a header: `Authorization: Bearer <token>`

---

### Example Request Payloads

#### Register Patient
```http
POST /auth/patient/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePass123",
  "phone": "555-0101"
}
```

#### Register Doctor
```http
POST /auth/doctor/register
Content-Type: application/json

{
  "name": "Dr. Alan Smith",
  "email": "alan@clinic.com",
  "password": "docPass456",
  "specialization": "Cardiology",
  "hospital": "City General Hospital"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "securePass123",
  "role": "patient"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f3a...",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

#### Send Request to All Doctors by Specialization
```http
POST /patient/request/all
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": "64f3a...",
  "specialization": "Cardiology",
  "query": "I have been experiencing chest pain and shortness of breath.",
  "startDate": "2025-08-10T10:00:00.000Z",
  "endDate": "2025-08-10T11:00:00.000Z"
}
```

#### Send Request to a Specific Doctor
```http
POST /patient/request/doctor
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": "64f3a...",
  "doctorId": "64f9b...",
  "query": "Follow-up on previous cardiac evaluation.",
  "startDate": "2025-08-11T14:00:00.000Z",
  "endDate": "2025-08-11T15:00:00.000Z"
}
```

#### Doctor Accepts an Appointment
```http
POST /doctor/accept/64fc1...
Authorization: Bearer <token>
```

---

## 🔮 Future Improvements

| Feature | Description |
|---------|-------------|
| 🔔 **Notification System** | Real-time email/SMS alerts when appointments are accepted or updated |
| 🤖 **AI Symptom Triage** | NLP-powered pre-screening to route patients to the right specialization |
| 📹 **Video Consultation** | WebRTC-based virtual appointments for remote patients |
| 📊 **Doctor Rating System** | Post-appointment reviews and ratings for quality tracking |
| ⚡ **Real-time Request Queue** | WebSocket-powered live doctor dashboard for incoming requests |
| 📱 **Mobile App Integration** | REST API hardened for React Native or Flutter frontend |
| 🏥 **Multi-hospital Support** | Scale the system across hospital networks and branches |
| 📆 **Recurring Appointments** | Support for follow-up schedules and recurring booking patterns |

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a clear message:
   ```bash
   git commit -m "feat: add real-time notification support"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch

### Guidelines

- Follow existing code style and naming conventions
- Write clear, concise commit messages (use [Conventional Commits](https://www.conventionalcommits.org/))
- Test all new endpoints in Postman before submitting a PR
- Document any new API endpoints in this README

---

## 📄 License

```
MIT License

Copyright (c) 2025 Patient Query & Appointment Interface Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

<div align="center">

Made with ❤️ for better healthcare.

**[⬆ Back to Top](#-patient-query--appointment-interface)**

</div>
