# 🛡️ HireDSafe – Fake Internship Detection Platform

A smart, modern platform to **report**, **search**, and **verify** companies to detect fake internship and job postings. Features an intelligent risk scoring system based on structured red-flag data.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue) ![Backend](https://img.shields.io/badge/Node.js-Express-green) ![Style](https://img.shields.io/badge/Tailwind_CSS-v4-purple)

---
Live Link: https://hiredsafe.vercel.app

## ✨ Features

- 🔍 **Smart Search** – Instantly search companies by name
- 🎯 **Risk Score Engine** – Automated 0–100 scoring based on red flags
- 🏷️ **Filters & Sorting** – Filter by risk level, platform, sort by most reported
- 📊 **Trending Scams** – Highlights the most dangerous flagged companies
- ⚠️ **Duplicate Detection** – Warns if a company has already been reported, merges reports to increase risk score
- 🎨 **Dark Cybersecurity UI** – Modern, professional design built with Tailwind CSS featuring glassmorphism, animations, and skeleton loaders
- 💬 **Community Engagement** – Upvote and comment on reports to warn others
- 🛡️ **Secure Reporting** – Delete or manage your reports securely using secret codes, backed by Supabase Row Level Security (RLS)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Start Backend (Port 5000)

```bash
cd server
npm run dev
```

### 3. Start Frontend (Port 5173)

```bash
cd client
npm run dev
```

### 4. Open in Browser

Visit **http://localhost:5173**

---

## 📁 Folder Structure

```
hiresafe/
├── server/
│   ├── index.js              # Express app entry
│   ├── routes/
│   │   └── reports.js        # API endpoints + seed data
│   └── utils/
│       └── scoreCalculator.js # Smart risk score logic
├── client/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css          # Design system
│       ├── pages/
│       │   ├── Home.jsx       # Dashboard with search, filters, cards
│       │   └── ReportForm.jsx # Report submission form
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── CompanyCard.jsx
│       │   ├── SearchBar.jsx
│       │   ├── FilterBar.jsx
│       │   ├── RiskBadge.jsx
│       │   ├── SkeletonCard.jsx
│       │   ├── EmptyState.jsx
│       │   └── DuplicateWarning.jsx
│       └── services/
│           └── api.js
└── README.md
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/reports` | All reports (supports `?search=`, `?risk=`, `?platform=`, `?sort=`) |
| `GET` | `/api/reports/:id` | Single report by ID |
| `POST` | `/api/reports` | Create/update report. Returns `409` on duplicate (unless `force: true`) |
| `POST` | `/api/reports/:id/upvote` | Upvote a specific report |
| `POST` | `/api/reports/:id/comment` | Add a comment to a specific report |
| `POST` | `/api/reports/verify-code` | Verify the secret code for a report |
| `DELETE` | `/api/reports/:id` | Delete a report using its secret code |
| `GET` | `/api/health` | Health check |

---

## 🧠 Smart Risk Score

| Red Flag | Points |
|----------|--------|
| Asked for money | +40 |
| Fake offer letter | +20 |
| No interview | +15 |
| Data theft | +15 |
| Unpaid work | +10 |
| Multiple reports | +15 |
| **Max Score** | **100** |

| Score Range | Risk Level | Color |
|-------------|------------|-------|
| 0–30 | Low Risk | 🟢 Green |
| 31–60 | Suspicious | 🟡 Yellow |
| 61–100 | High Risk | 🔴 Red |

---

## 🗄️ Database & Security

This project uses **Supabase** for robust data persistence.
- **Row Level Security (RLS)** is configured to protect data integrity, ensuring reports cannot be arbitrarily modified or deleted without the appropriate `secret_code`.
- Environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) are securely managed via `.env`.

To set up locally:
1. Create a Supabase project.
2. Run the SQL schema to create the `reports` table.
3. Configure RLS policies to secure access.
4. Add your `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `server/.env`.

---

## 🌍 Deployment

The platform is structured for easy deployment to modern cloud providers:
- **Frontend**: Designed to be hosted on [Vercel](https://vercel.com/) for fast, edge-network delivery. Ensure the `VITE_API_URL` environment variable is set to your backend URL.
- **Backend**: Designed to be hosted on [Render](https://render.com/) or similar platforms running the Express.js server. Configure the relevant environment variables (Supabase credentials) and start commands.

---

## 📄 License

MIT
