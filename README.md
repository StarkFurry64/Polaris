# 🌟 Polaris — AI-Driven Enterprise Delivery Intelligence

Polaris is a full-stack engineering intelligence platform that unifies your GitHub, Jira, and AI-powered insights into a single, beautiful dashboard. It helps engineering teams track DORA metrics, analyze developer performance, surface bottlenecks, and get AI-generated recommendations — all in real time.

---

## ✨ Features

- **📊 DORA Metrics** — Track Deployment Frequency, Lead Time, Change Failure Rate, and MTTR
- **🤖 AI Insights Chatbot** — Powered by Groq (LLaMA 3.3 70B) for grounded, context-aware engineering advice
- **🐛 GitHub Issues Integration** — Personalized bug metrics pulled directly from your repositories
- **📋 Jira Dashboard** — View, filter, and assign Jira tickets with priority badges and distribution charts
- **👥 Developer Metrics** — Per-contributor analytics, PR review times, and commit patterns
- **💡 Business Recommendations** — AI-generated insights tailored to your team's delivery data
- **📧 Email Notifications** — Notify contributors of task assignments via SMTP
- **🔐 Firebase Auth** — Secure login and session management
- **🎨 Demo Mode** — Explore with synthetic data when no GitHub Issues are available

---

## 🗂️ Project Structure

```
Polaris/
├── backend/               # Node.js + Express API server
│   ├── routes/            # API route handlers (AI, GitHub, Jira, metrics)
│   ├── services/          # Business logic (LLM, GitHub, Jira, email)
│   ├── server.js          # Entry point
│   ├── .env.example       # ← Copy to .env and fill in your keys
│   └── package.json
│
└── frontend/              # React + Vite + TypeScript
    ├── src/
│   ├── components/    # Dashboard pages and UI primitives
│   ├── pages/         # Route-level page components
│   ├── services/      # API & chat service clients
│   ├── contexts/      # Auth context (Firebase)
│   └── lib/           # Utilities and data helpers
    ├── .env.example       # ← Copy to .env and fill in your keys
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A [Groq](https://console.groq.com) API key
- A [Firebase](https://console.firebase.google.com) project
- (Optional) A Jira account with API token
- (Optional) A GitHub Personal Access Token

---

### 1. Clone the repository

```bash
git clone https://github.com/StarkFurry64/Polaris.git
cd Polaris
```

---

### 2. Configure the Backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your credentials:

```env
PORT=3001
NODE_ENV=development

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

JIRA_BASE_URL=https://yourcompany.atlassian.net
JIRA_API_TOKEN=your_jira_api_token
JIRA_EMAIL=your@email.com
JIRA_PROJECT_KEY=YOUR_KEY

GITHUB_TOKEN=your_github_pat
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name

CORS_ORIGIN=http://localhost:8080

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_APP_PASSWORD=your_gmail_app_password
```

Install dependencies and start the server:

```bash
npm install
npm run dev
```

The backend runs on **http://localhost:3001**

---

### 3. Configure the Frontend

```bash
cd ../frontend
cp .env.example .env
```

Open `frontend/.env` and fill in your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The frontend runs on **http://localhost:8080**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI Components | shadcn/ui (Radix UI primitives) |
| Charts | Recharts |
| Animations | Framer Motion |
| Auth | Firebase Authentication |
| Backend | Node.js, Express |
| AI / LLM | Groq (LLaMA 3.3 70B), Google Gemini |
| Integrations | GitHub REST API, Jira REST API |
| Email | Nodemailer (Gmail SMTP) |

---

## 🔐 Security

> **Never commit `.env` files.** They are excluded from version control via `.gitignore`.

- Use `.env.example` as a template — it contains no real credentials
- Rotate any API keys that may have been previously exposed
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your account password

---

## 📄 License

This project is for educational and internal use. All rights reserved.
