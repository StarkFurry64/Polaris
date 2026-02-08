// API client for frontend with user authentication support
const API_BASE = 'http://localhost:3001/api';

// Helper to create headers with optional GitHub token
function getHeaders(githubToken?: string | null): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (githubToken) {
        headers['X-GitHub-Token'] = githubToken;
    }
    return headers;
}

// GitHub API - Now supports user's own token
export async function getRepositories(githubToken?: string | null) {
    if (githubToken) {
        // Use user's token to fetch their repos directly from GitHub
        const res = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: 'application/vnd.github+json'
            }
        });
        const repos = await res.json();
        return Array.isArray(repos) ? repos.map((repo: any) => ({
            name: repo.name,
            fullName: repo.full_name,
            updatedAt: repo.updated_at,
            private: repo.private,
            description: repo.description
        })) : [];
    }
    // Fallback to backend
    const res = await fetch(`${API_BASE}/github/repos`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function getCommits(repo: string, githubToken?: string | null) {
    if (githubToken) {
        // Use user's token to fetch commits directly from GitHub
        const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=100`, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: 'application/vnd.github+json'
            }
        });
        const commits = await res.json();
        return Array.isArray(commits) ? commits : [];
    }
    // Fallback to backend
    const res = await fetch(`${API_BASE}/github/repos/${repo}/commits`);
    const data = await res.json();
    return data.success ? data.data : [];
}

export async function getPullRequests(repo: string, githubToken?: string | null) {
    if (githubToken) {
        // Use user's token to fetch PRs directly from GitHub
        const res = await fetch(`https://api.github.com/repos/${repo}/pulls?state=all&per_page=100`, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: 'application/vnd.github+json'
            }
        });
        const prs = await res.json();
        return Array.isArray(prs) ? prs : [];
    }
    // Fallback to backend
    const res = await fetch(`${API_BASE}/github/repos/${repo}/pulls`);
    const data = await res.json();
    return data.success ? data.data : [];
}

export async function getContributors(repo: string, githubToken?: string | null) {
    if (githubToken) {
        // Use user's token to fetch contributors directly from GitHub
        const res = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=100`, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: 'application/vnd.github+json'
            }
        });
        const contributors = await res.json();
        return Array.isArray(contributors) ? contributors : [];
    }
    // Fallback to backend
    const res = await fetch(`${API_BASE}/github/repos/${repo}/contributors`);
    const data = await res.json();
    return data.success ? data.data : [];
}

export async function getGitHubIssues(repo: string, githubToken?: string | null) {
    if (githubToken) {
        // Use user's token to fetch issues directly from GitHub
        const res = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100`, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: 'application/vnd.github+json'
            }
        });
        const issues = await res.json();
        return Array.isArray(issues) ? issues : [];
    }
    // Fallback to backend
    const res = await fetch(`${API_BASE}/github/repos/${repo}/issues`);
    const data = await res.json();
    return data.success ? data.data : [];
}

// Jira API (still uses backend - no GitHub token needed)
export async function getJiraIssues() {
    const res = await fetch(`${API_BASE}/jira/issues`);
    const data = await res.json();
    return data.success ? data.data : [];
}

// AI API
export async function askAI(question: string, repo: string, githubToken?: string | null) {
    const res = await fetch(`${API_BASE}/ai/ask`, {
        method: 'POST',
        headers: getHeaders(githubToken),
        body: JSON.stringify({ question, repo })
    });
    return res.json();
}
