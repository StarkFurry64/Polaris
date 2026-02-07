// API client for Polaris backend
const API_BASE = 'http://localhost:3001/api';

// Generic fetch wrapper
async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}

// Health check
export async function checkHealth() {
    return apiRequest('/health');
}

// ============ JIRA API ============

export async function getJiraProjects() {
    return apiRequest('/jira/projects');
}

export async function getJiraIssues(projectKey: string, maxResults = 50) {
    return apiRequest(`/jira/projects/${projectKey}/issues?maxResults=${maxResults}`);
}

export async function getJiraVelocity(projectKey: string) {
    return apiRequest(`/jira/projects/${projectKey}/velocity`);
}

export async function getJiraWorkload(projectKey: string) {
    return apiRequest(`/jira/projects/${projectKey}/workload`);
}

export async function getJiraAnalytics(projectKey: string) {
    return apiRequest(`/jira/projects/${projectKey}/analytics`);
}

// ============ GITHUB API ============

export async function getGitHubUser() {
    return apiRequest('/github/user');
}

export async function getGitHubRepos(perPage = 30) {
    return apiRequest(`/github/repos?perPage=${perPage}`);
}

export async function getGitHubCommits(owner: string, repo: string, perPage = 30) {
    return apiRequest(`/github/repos/${owner}/${repo}/commits?perPage=${perPage}`);
}

export async function getGitHubPRs(owner: string, repo: string, state = 'all') {
    return apiRequest(`/github/repos/${owner}/${repo}/pulls?state=${state}`);
}

export async function getGitHubContributors(owner: string, repo: string) {
    return apiRequest(`/github/repos/${owner}/${repo}/contributors`);
}

export async function getGitHubRepoAnalytics(owner: string, repo: string) {
    return apiRequest(`/github/repos/${owner}/${repo}/analytics`);
}

export async function getGitHubPRMetrics(owner: string, repo: string) {
    return apiRequest(`/github/repos/${owner}/${repo}/pr-metrics`);
}

export async function getLanguageDistribution() {
    return apiRequest('/github/language-distribution');
}

// ============ AI API ============

export async function analyzeDeliveryRisk(projectData: any) {
    return apiRequest('/ai/analyze-delivery', {
        method: 'POST',
        body: JSON.stringify({ projectData }),
    });
}

export async function analyzeTeamPerformance(teamData: any) {
    return apiRequest('/ai/analyze-team', {
        method: 'POST',
        body: JSON.stringify({ teamData }),
    });
}

export async function analyzeCosts(costData: any) {
    return apiRequest('/ai/analyze-costs', {
        method: 'POST',
        body: JSON.stringify({ costData }),
    });
}

export async function generateExecutiveSummary(allData: any) {
    return apiRequest('/ai/executive-summary', {
        method: 'POST',
        body: JSON.stringify({ allData }),
    });
}

export async function askAI(question: string, context: any = {}) {
    return apiRequest('/ai/ask', {
        method: 'POST',
        body: JSON.stringify({ question, context }),
    });
}

export default {
    checkHealth,
    // Jira
    getJiraProjects,
    getJiraIssues,
    getJiraVelocity,
    getJiraWorkload,
    getJiraAnalytics,
    // GitHub
    getGitHubUser,
    getGitHubRepos,
    getGitHubCommits,
    getGitHubPRs,
    getGitHubContributors,
    getGitHubRepoAnalytics,
    getGitHubPRMetrics,
    getLanguageDistribution,
    // AI
    analyzeDeliveryRisk,
    analyzeTeamPerformance,
    analyzeCosts,
    generateExecutiveSummary,
    askAI,
};
