# 🛡️ HireDSafe – Fake Internship Detection Platform

A smart, modern platform to **report**, **search**, and **verify** companies to detect fake internship and job postings. Features an intelligent risk scoring system based on structured red-flag data.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue) ![Backend](https://img.shields.io/badge/Node.js-Express-green) ![Style](https://img.shields.io/badge/Tailwind_CSS-v4-purple)

---

## ✨ Features

- 🔍 **Smart Search** – Instantly search companies by name
- 🎯 **Risk Score Engine** – Automated 0–100 scoring based on red flags
- 🏷️ **Filters & Sorting** – Filter by risk level, platform, sort by most reported
- 📊 **Trending Scams** – Highlights the most dangerous flagged companies
- ⚠️ **Duplicate Detection** – Warns if a company has already been reported, merges reports to increase risk score
- 🎨 **Premium Dark UI** – Glassmorphism, animations, skeleton loaders

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

## 🔮 Future Enhancements (Supabase)

To connect to Supabase:
1. Create a Supabase project
2. Run the SQL migration in `server/.env.example`
3. Add your `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `server/.env`
4. Replace the in-memory store in `routes/reports.js` with Supabase client calls

---

## 📄 License

MIT
