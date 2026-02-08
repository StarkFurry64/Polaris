<p align="center">
  <img src="frontend/public/polaris-icon.svg" alt="Polaris Logo" width="80" height="80">
</p>

<h1 align="center">🌟 Polaris - Enterprise Intelligence Dashboard</h1>

<p align="center">
  <strong>AI-Powered Development Analytics & Team Intelligence Platform</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#architecture">Architecture</a>
</p>

---

## 📖 Overview

**Polaris** is a comprehensive enterprise intelligence dashboard that provides real-time insights into your development workflow. It integrates with GitHub and Jira to deliver actionable analytics, AI-powered recommendations, and team performance metrics.

### Key Highlights
- 🤖 **AI-Powered Insights** - Natural language queries about your repository using Google Gemini
- 📊 **Executive Dashboard** - High-level metrics for stakeholders and managers
- 👥 **Developer Analytics** - Individual and team performance tracking
- 🚨 **Risk Detection** - Automatic identification of blockers, stale PRs, and bus factor risks
- 📧 **Smart Notifications** - Email alerts for task assignments via Nodemailer

---

## ✨ Features

### 📈 Executive Dashboard
- Sprint velocity and burn-down metrics
- Issue distribution and status tracking
- Business recommendations powered by AI
- Risk alerts with severity levels

### 💻 Developer Metrics
- Contributor activity and commit history
- Knowledge concentration analysis (Bus Factor)
- Workload distribution visualization
- Pull request analytics

### 🎫 Jira Integration
- Real-time issue synchronization
- Status filtering and search
- Direct task assignment with email notifications
- Priority and type categorization

### 🧠 AI Insights
- Chat-based interface for repository queries
- Contextual analysis of commits, PRs, and issues
- Automated recommendations and insights
- Powered by Google Gemini 1.5 Flash

### 🔥 Firebase Integration
- Secure authentication (Google Sign-In)
- Chat history persistence
- Real-time data synchronization

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Recharts | Data Visualization |
| Radix UI | Component Primitives |
| React Router | Navigation |
| Firebase SDK | Auth & Database |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | API Server |
| Google Gemini AI | AI Analysis |
| Nodemailer | Email Notifications |
| Octokit | GitHub API |
| Axios | HTTP Client |

### External Services
- **GitHub API** - Repository data
- **Jira API** - Issue tracking
- **Firebase** - Authentication & Firestore
- **Google Gemini** - AI capabilities

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub Personal Access Token
- Jira API credentials (optional)
- Firebase project
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/StarkFurry64/Polaris.git
cd Polaris
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=3001
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
JIRA_HOST=your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start the frontend:
```bash
npm run dev
```

### 4. Access the Application
Open [http://localhost:5173](http://localhost:8080) in your browser.

---

## 📱 Usage

### Dashboard Navigation
1. **Executive** - High-level metrics and risk overview
2. **Insights** - Detailed analytics and charts
3. **Developers** - Team member performance
4. **Jira** - Issue management and assignment
5. **AI Insights** - Chat with AI about your repository

### Selecting a Repository
1. Click on "Select Repository" in the header
2. Enter your GitHub username/organization
3. Choose a repository from the list
4. Data will automatically sync

### AI Chat
1. Navigate to "AI Insights"
2. Ask questions like:
   - "What are the key metrics for this repository?"
   - "Who are the most active contributors?"
   - "Summarize the recent PR activity"
   - "What patterns do you see in the commits?"

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │Executive│  │Developer│  │  Jira   │  │   AI Insights   │ │
│  │Dashboard│  │ Metrics │  │  Page   │  │    (Chat)       │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └───────┬─────────┘ │
│       │            │            │               │            │
│  ┌────┴────────────┴────────────┴───────────────┴──────────┐│
│  │                    React + TypeScript                    ││
│  │                    Tailwind CSS + Radix UI               ││
│  └─────────────────────────┬───────────────────────────────┘│
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Express.js Server                      ││
│  └────┬─────────────────┬─────────────────┬────────────────┘│
│       │                 │                 │                  │
│  ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐           │
│  │ GitHub  │      │  Gemini   │     │  Email    │           │
│  │ Service │      │  AI Svc   │     │  Service  │           │
│  └────┬────┘      └─────┬─────┘     └─────┬─────┘           │
└───────┼─────────────────┼─────────────────┼─────────────────┘
        │                 │                 │
        ▼                 ▼                 ▼
   ┌─────────┐      ┌─────────┐       ┌─────────┐
   │ GitHub  │      │ Google  │       │  SMTP   │
   │   API   │      │ Gemini  │       │ Server  │
   └─────────┘      └─────────┘       └─────────┘
```

---

## 📁 Project Structure

```
Polaris/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── ExecutiveDashboard.tsx
│   │   │   │   ├── DeveloperMetricsPage.tsx
│   │   │   │   ├── JiraPage.tsx
│   │   │   │   ├── AIInsightsPage.tsx
│   │   │   │   └── PRAnalyticsPage.tsx
│   │   │   └── ui/           # Reusable UI components
│   │   ├── lib/
│   │   │   └── firebase.ts   # Firebase configuration
│   │   ├── pages/
│   │   │   └── LoginPage.tsx
│   │   └── App.tsx
│   └── package.json
│
├── backend/
│   ├── services/
│   │   ├── aiService.js      # Gemini AI integration
│   │   ├── githubService.js  # GitHub API wrapper
│   │   └── jiraService.js    # Jira API wrapper
│   ├── routes/
│   │   ├── github.js
│   │   ├── jira.js
│   │   ├── ai.js
│   │   └── notifications.js
│   ├── index.js              # Express server entry
│   └── package.json
│
└── README.md
```

---

## 🎨 Design System

Polaris uses a **Linear-inspired dark theme** with:
- **Primary Color**: Purple (`#a855f7`)
- **Background**: Deep black (`#0a0a0f`)
- **Cards**: Dark gray with subtle borders
- **Accents**: Gradient glows and glassmorphism effects

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Built with ❤️ for the Datathon competition.

---

<p align="center">
  <strong>⭐ Star this repo if you find it useful!</strong>
</p>
