# Bluestock Phase 1 – Fintech Internship Task

This project is created as part of my **Software Developer Engineer Internship** at **Bluestock Finance** (Phase 1 – Foundation).

It includes a working setup of:

- React + Vite project boilerplate
- Tailwind CSS UI setup
- Firebase Google Authentication
- IndexedDB storage for user session data
- GitHub + Vercel deployment pipeline

---

## 🔗 Live Demo

https://bluestock-phase1-ch6dm0j6p-vicky-shindes-projects-b1d3a340.vercel.app

---

## ✅ Features Implemented (Phase 1)

- ⚡ React + Vite setup
- 🎨 Tailwind CSS configured and working
- 🔐 Google Sign-in using Firebase Authentication
- 🚪 Logout functionality
- 🔒 Protected route (Dashboard requires login)
- 💾 IndexedDB storage using `idb`
  - Saves user info after login
  - Displays stored email + login time
  - Clears IndexedDB on logout
- 🚀 Deployed on Vercel with CI/CD from GitHub

---

## 🧰 Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth (Google)
- **Local Storage:** IndexedDB (`idb`)
- **Deployment:** Vercel
- **Version Control:** Git + GitHub

---

## Backend (Neon PostgreSQL)

A minimal Express backend is included inside `/server`.

Available endpoints:
- `/health` → checks server status
- `/db-test` → verifies Neon PostgreSQL connection


---

## ⚙️ Setup Instructions (Run Locally)

### 1) Clone the repository
```bash
git clone https://github.com/vickyshinde30805/bluestock-phase1.git
cd bluestock-phase1
