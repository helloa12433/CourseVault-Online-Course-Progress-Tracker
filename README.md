# CourseVault — Online Course Progress Tracker

**CourseVault** is a lightweight, user-friendly web application that helps students manage and track their online learning journey across platforms like Udemy, Coursera, YouTube, and more. Built as a MERN-style project with a Vite + React frontend and a Node.js/Express + MongoDB backend, CourseVault focuses on simplicity, clear progress visualization, and practical CRUD features you can extend for a real-world product.

---

## 📘 Description

CourseVault is a MERN-based web application that helps students organize and track their online courses from platforms like Udemy, YouTube, Coursera, and more. With features like progress tracking, course categorization, and intuitive CRUD operations, CourseVault ensures learners stay consistent and motivated throughout their learning journey. Designed with Vite + React on the frontend and Node.js + Express + MongoDB on the backend, it follows real-world project architecture and clean code best practices.

---

## 🚀 Quick overview

* Add courses with platform, link, category and notes
* Track status: **Not Started**, **In Progress**, **Completed**
* Visual progress bars and overall progress summary
* Full CRUD (create, read, update, delete) for courses
* Filter & search by title, platform, category, or status
* Auth-ready backend structure so you can add users later

---

## 🧩 Tech stack

* **Frontend**: React (Vite) — fast dev server, modern setup
* **Backend**: Node.js + Express — RESTful API
* **Database**: MongoDB (Mongoose) — flexible document model
* **Dev tooling**: ESLint / Prettier (optional), concurrently (optional), dotenv
* **Optional**: Dockerfile and docker-compose for containerized dev

---

## ✅ Features (implemented)

* Add / edit / delete courses
* Update course status and progress percentage
* Search courses by title
* Filter by category and status
* Responsive UI with progress bars per course and aggregated stats

---

## 📁 Recommended repository structure

```
coursevault/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  │  └─ courseController.js
│  │  ├─ models/
│  │  │  └─ Course.js
│  │  ├─ routes/
│  │  │  └─ courseRoutes.js
│  │  ├─ middlewares/
│  │  │  └─ errorHandler.js
│  │  ├─ utils/
│  │  └─ index.js
│  ├─ .env
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ CourseCard.jsx
│  │  │  ├─ CourseForm.jsx
│  │  │  └─ ProgressBar.jsx
│  │  ├─ pages/
│  │  │  ├─ Home.jsx
│  │  │  └─ CourseDetails.jsx
│  │  ├─ api/
│  │  │  └─ api.js
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ index.html
│  └─ package.json
├─ .gitignore
└─ README.md
```

---

## 🗄️ Database schema (Mongoose example)

```js
// models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, default: 'Other' },
  link: { type: String },
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['Not Started','In Progress','Completed'], default: 'Not Started' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
```

---

## 🔌 API routes (REST)

Base: `/api/v1/courses`

* `GET /api/v1/courses` — list courses (supports query params `?q=title&status=In%20Progress&category=Web` and pagination `?page=1&limit=20`)
* `GET /api/v1/courses/:id` — get single course
* `POST /api/v1/courses` — create course

  * body: `{ title, platform, link, category, status, progress, notes }`
* `PUT /api/v1/courses/:id` — update course

  * body: any of the fields above
* `PATCH /api/v1/courses/:id/status` — quick update status/progress

  * body: `{ status, progress }`
* `DELETE /api/v1/courses/:id` — delete course

**Responses** should follow a simple envelope format:

```json
{ "success": true, "data": {...}, "message": "Course created" }
```

---

## 📌 Example cURL

```bash
# List courses
curl -s "http://localhost:5000/api/v1/courses?q=react&status=In%20Progress"

# Create course
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"React + Vite Course","platform":"YouTube","link":"https://...","category":"Frontend","status":"Not Started","progress":0}'
```

---

## 🛠️ Setup & run locally

### Prerequisites

* Node.js (v18+ recommended)
* npm or yarn
* MongoDB (local or Atlas)

### 1) Clone

```bash
git clone <repo-url>
cd coursevault
```

### 2) Backend

```bash
cd backend
cp .env.example .env  # set MONGO_URI and PORT
npm install
npm run dev            # or `node src/index.js` for production
```

**.env** (example)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/coursevault
```

### 3) Frontend

```bash
cd frontend
npm install
npm run dev            # Vite dev server (usually localhost:5173)
```

### 4) Run both concurrently (optional)

From project root, you can add a script using `concurrently` that runs both servers for convenience.

---

## ♻️ Frontend notes

* Keep API calls in a single `api/api.js` file so switching base URLs is easy.
* Use React context or Zustand/Redux for global state if you plan to add auth and multiple users.
* Components:

  * `CourseCard` — compact card with title, status, progress
  * `CourseForm` — add/edit form with validation
  * `ProgressBar` — small reusable progress visualization

---

## ✅ Roadmap & next steps

* Add authentication (JWT + user profiles)
* Allow multiple users + private course lists
* Sync course progress via platform APIs (where available)
* Add reminders / study schedule and calendar integration
* Export/import CSV of courses
* Mobile-first responsive improvements and PWA support

---

## 🤝 Contributing

Contributions welcome — open issues for bugs or features. Please follow these steps:

1. Fork the repo
2. Create a feature branch
3. Add tests & update README if needed
4. Create a PR with a clear description


