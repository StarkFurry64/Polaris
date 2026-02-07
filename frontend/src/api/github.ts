// API client for frontend
const API_BASE = 'http://localhost:3001/api';

// GitHub API
export async function getRepositories() {
    const res = await fetch(`${API_BASE}/github/repos`);
    const data = await res.json();
    return data.success ? data.data : [];
}

export async function getCommits(repo: string) {
    const res = await fetch(`${API_BASE}/github/repos/${repo}/commits`);
    const data = await res.json();
    return data.success ? data.data : [];
}

export async function getPullRequests(repo: string) {
    const res = await fetch(`${API_BASE}/github/repos/${repo}/pulls`);
    const data = await res.json();
    return data.success ? data.data : [];
}

export async function getContributors(repo: string) {
    const res = await fetch(`${API_BASE}/github/repos/${repo}/contributors`);
    const data = await res.json();
    return data.success ? data.data : [];
}

// Jira API
export async function getJiraIssues() {
    const res = await fetch(`${API_BASE}/jira/issues`);
    const data = await res.json();
    return data.success ? data.data : [];
}

// AI API
export async function askAI(question: string, context: any = {}) {
    const res = await fetch(`${API_BASE}/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context })
    });
    return res.json();
}
