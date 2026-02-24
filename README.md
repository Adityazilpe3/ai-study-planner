# AI Study Planner Dashboard — Full MERN Stack

A fully functional AI-powered study planning website built with React, Node.js, Express, MongoDB, JWT Auth, and Google Gemini API.

---

## Folder Structure

```
ai-study-planner/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Plan.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── planRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PlanCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── PlanDetail.jsx
    │   │   └── Profile.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/studyplanner
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Start backend:
```bash
npm run dev    # development (nodemon)
npm start      # production
```

Backend runs at: **http://localhost:5000**

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste it into your `.env` file

---

## Pages

| Route | Page | Auth |
|-------|------|------|
| `/` | Landing Page | Public |
| `/register` | Register | Public |
| `/login` | Login | Public |
| `/dashboard` | Dashboard | Protected |
| `/plans/:id` | Plan Detail | Protected |
| `/profile` | User Profile | Protected |

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login & get JWT |
| GET | `/api/user/profile` | ✅ | Get user profile |
| PUT | `/api/user/profile` | ✅ | Update name/bio/password |
| POST | `/api/plans/generate-plan` | ✅ | Generate AI plan |
| GET | `/api/plans` | ✅ | Get all plans (with search & filter) |
| GET | `/api/plans/:id` | ✅ | Get single plan |
| PATCH | `/api/plans/:id` | ✅ | Update progress/notes |
| DELETE | `/api/plans/:id` | ✅ | Delete a plan |

---

## Features

- ✅ Landing page with hero, features, how-it-works, CTA
- ✅ User registration & login with JWT
- ✅ AI study plan generation (Google Gemini)
- ✅ Dashboard with stats (total, completed, in-progress)
- ✅ Search plans by subject
- ✅ Filter plans (all / active / completed)
- ✅ Progress tracker with drag slider
- ✅ Plan detail page with full AI plan text
- ✅ Personal notes per plan
- ✅ Exam countdown badges
- ✅ User profile with name/bio editing
- ✅ Password change functionality
- ✅ Fully responsive design
- ✅ Protected routes with auto-redirect

---

## Tech Stack

- **Frontend**: React 18, React Router v6, Axios, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + bcryptjs
- **AI**: Google Gemini 1.5 Flash (REST API)
- **Styling**: Pure CSS (no UI libraries)
