# 🎓 LMS Portal — Full Stack MERN Application

> A professional Learning Management System with JWT auth, role-based access, course management, progress tracking, file uploads, and PDF certificates.

---

## 📁 COMPLETE FILE STRUCTURE

```
lms/
├── backend/
│   ├── .env                          ← MongoDB URI + JWT secret
│   ├── package.json
│   ├── uploads/                      ← Auto-created by server (gitignore this)
│   └── src/
│       ├── server.js                 ← Express app entry point
│       ├── config/
│       │   └── db.js                 ← MongoDB connection
│       ├── models/
│       │   ├── User.js               ← name, email, password, role, bio
│       │   ├── Course.js             ← title, desc, instructor, category, level, materials[]
│       │   ├── Enrollment.js         ← student + course ref, completedAt
│       │   └── Progress.js           ← student + course ref, percentage
│       ├── middleware/
│       │   ├── authMiddleware.js     ← JWT verify, attaches req.user
│       │   ├── roleMiddleware.js     ← Role guard (instructor/student)
│       │   └── uploadMiddleware.js  ← Multer config, 50MB limit
│       ├── controllers/
│       │   ├── authController.js     ← register, login, getMe, updateProfile
│       │   ├── courseController.js   ← CRUD + instructor courses
│       │   ├── enrollmentController.js ← enroll, list, check, unenroll
│       │   ├── progressController.js ← update, get, per-course
│       │   ├── dashboardController.js ← stats, instructor stats, chart data
│       │   ├── uploadController.js   ← file upload, course material upload
│       │   └── certificateController.js ← PDF cert generation (PDFKit)
│       └── routes/
│           ├── authRoutes.js         ← /api/auth/*
│           ├── courseRoutes.js       ← /api/courses/*
│           ├── enrollmentRoutes.js   ← /api/enrollments/*
│           ├── progressRoutes.js     ← /api/progress/*
│           ├── dashboardRoutes.js    ← /api/dashboard/*
│           ├── uploadRoutes.js       ← /api/upload/*
│           └── certificateRoutes.js  ← /api/certificate/*
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx                  ← React entry point
        ├── App.jsx                   ← Routes + providers
        ├── index.css                 ← Full design system (CSS variables, components)
        ├── context/
        │   ├── AuthContext.jsx       ← Login, register, logout, user state
        │   └── ThemeContext.jsx      ← Dark/light mode toggle
        ├── services/
        │   └── api.js                ← Axios instance + interceptors
        ├── components/
        │   ├── Layout.jsx            ← Sidebar + Navbar wrapper
        │   ├── Navbar.jsx            ← Top nav with user info
        │   ├── Sidebar.jsx           ← Fixed sidebar with nav links
        │   ├── ProtectedRoute.jsx    ← Auth guard for private routes
        │   ├── CourseCard.jsx        ← Course display card
        │   ├── CourseModal.jsx       ← Create/edit course modal
        │   ├── StatsChart.jsx        ← Recharts bar + area charts
        │   └── CertificateButton.jsx ← Download PDF cert button
        └── pages/
            ├── Login.jsx             ← Split-screen login with features
            ├── Register.jsx          ← Split-screen register with role toggle
            ├── Dashboard.jsx         ← Stats + charts + quick actions
            ├── Courses.jsx           ← Browse + search + filter + enroll
            ├── MyCourses.jsx         ← Enrolled courses + progress controls
            ├── Progress.jsx          ← Progress charts + per-course detail
            ├── InstructorPanel.jsx   ← Create/edit/delete courses + stats
            ├── Upload.jsx            ← Drag-drop file upload to courses
            └── Profile.jsx           ← Edit profile + security + prefs
```

---

## 🚀 SETUP INSTRUCTIONS

### 1. Backend Setup

```bash
cd backend
npm install
# Make sure .env is configured:
# PORT=5000
# MONGO_URI=your_mongodb_atlas_uri
# JWT_SECRET=your_secret_key

npm run dev   # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev   # Starts on http://localhost:5173
```

---

## 🌐 API ENDPOINTS

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register user |
| POST | /api/auth/login | ❌ | Login, get token |
| GET | /api/auth/me | ✅ | Get current user |
| PUT | /api/auth/profile | ✅ | Update name/bio |
| GET | /api/courses | ❌ | List all courses (search/filter) |
| POST | /api/courses | ✅ Instructor | Create course |
| PUT | /api/courses/:id | ✅ Instructor | Update course |
| DELETE | /api/courses/:id | ✅ Instructor | Delete course |
| GET | /api/courses/my-courses | ✅ Instructor | Instructor's courses |
| POST | /api/enrollments | ✅ | Enroll in course |
| GET | /api/enrollments/my-courses | ✅ | Get my enrollments |
| DELETE | /api/enrollments/:courseId | ✅ | Unenroll |
| POST | /api/progress | ✅ | Update progress % |
| GET | /api/progress | ✅ | Get all my progress |
| GET | /api/dashboard/stats | ✅ | Global stats + chart |
| GET | /api/dashboard/instructor-stats | ✅ | Instructor stats |
| POST | /api/upload | ✅ | Upload single file |
| POST | /api/upload/material | ✅ Instructor | Upload to course |
| GET | /api/certificate/:courseId | ✅ | Download PDF cert |

---

## ✅ FEATURES CHECKLIST

- [x] JWT Authentication (7-day tokens)
- [x] Student & Instructor Roles
- [x] Course CRUD (Instructor only)
- [x] Course Search & Filter (category, level, text)
- [x] Course Enrollment & Unenrollment
- [x] Progress Tracking (0–100%)
- [x] Dashboard Analytics + Charts
- [x] Dark Mode (persisted in localStorage)
- [x] Responsive UI (mobile sidebar)
- [x] Toast Notifications
- [x] File Upload (Multer, drag & drop)
- [x] Course Materials Viewer
- [x] PDF Certificates (PDFKit, download on completion)
- [x] MongoDB Atlas
- [x] Password strength indicator
- [x] Auto-enroll progress on enrollment
- [x] Instructor panel with student stats

---

## 🎨 DESIGN SYSTEM

- **Fonts**: Syne (display/headings) + DM Sans (body)
- **Theme**: CSS custom properties, dark/light toggle
- **Colors**: Indigo accent, semantic success/warning/danger/info
- **Components**: Cards, badges, buttons, modals, forms, progress bars, charts
- **Animation**: fade-in, slide-up, shimmer skeleton loaders
---