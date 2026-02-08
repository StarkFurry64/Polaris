import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fetchRepos, fetchCommits, fetchPullRequests, fetchContributors } from "./githubClient.js";
import { fetchJiraIssues } from "./jiraClient.js";
import { aiRouter } from "./routes/ai.js";
import notificationsRoutes from "./src/routes/notifications.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            jira: !!process.env.JIRA_API_TOKEN,
            jiraProject: process.env.JIRA_PROJECT_KEY,
            github: !!process.env.GITHUB_TOKEN,
            githubOwner: process.env.GITHUB_OWNER,
            gemini: !!process.env.GEMINI_API_KEY
        }
    });
});

// GitHub Routes - locked to GITHUB_OWNER
app.get("/api/github/repos", async (req, res) => {
    try {
        const repos = await fetchRepos();
        res.json(repos);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
});

app.get("/api/github/repos/:repo/commits", async (req, res) => {
    try {
        const commits = await fetchCommits(req.params.repo);
        res.json({ success: true, data: commits });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/api/github/repos/:repo/pulls", async (req, res) => {
    try {
        const prs = await fetchPullRequests(req.params.repo);
        res.json({ success: true, data: prs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/api/github/repos/:repo/contributors", async (req, res) => {
    try {
        const contributors = await fetchContributors(req.params.repo);
        res.json({ success: true, data: contributors });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get contributor's email from their commits
app.get("/api/github/repos/:repo/contributors/:username/email", async (req, res) => {
    try {
        const email = await fetchContributorEmail(req.params.repo, req.params.username);
        if (email) {
            res.json({ success: true, email });
        } else {
            res.json({ success: false, error: 'Email not found in commits' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Jira Routes - locked to JIRA_PROJECT_KEY
app.get("/api/jira/issues", async (req, res) => {
    try {
        const issues = await fetchJiraIssues();
        res.json({ success: true, data: issues });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// AI Routes
app.use('/api/ai', aiRouter);

// Notifications Routes (Email)
app.use('/api/notifications', notificationsRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
    console.log(`🚀 Polaris Backend running on http://localhost:${PORT}`);
    console.log(`📊 Jira: ${process.env.JIRA_BASE_URL} (Project: ${process.env.JIRA_PROJECT_KEY})`);
    console.log(`🐙 GitHub Owner: ${process.env.GITHUB_OWNER}`);
    console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'Ready' : 'Not configured'}`);
});
