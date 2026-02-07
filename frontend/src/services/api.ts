// API service for connecting to Polaris backend

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Fetch dashboard metrics for a repository
 */
export async function fetchDashboardMetrics(owner: string, repo: string) {
  const response = await fetch(`${API_BASE_URL}/metrics/dashboard/${owner}/${repo}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard metrics');
  }
  return response.json();
}

/**
 * Fetch GitHub PR metrics
 */
export async function fetchPRMetrics(owner: string, repo: string) {
  const response = await fetch(`${API_BASE_URL}/github/repos/${owner}/${repo}/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch PR metrics');
  }
  return response.json();
}

/**
 * Fetch all repositories for a GitHub user/owner
 */
export async function fetchUserRepos(owner: string) {
  const response = await fetch(`${API_BASE_URL}/github/users/${owner}/repos`);
  if (!response.ok) {
    throw new Error('Failed to fetch user repos');
  }
  return response.json();
}

/**
 * Fetch repository info
 */
export async function fetchRepository(owner: string, repo: string) {
  const response = await fetch(`${API_BASE_URL}/github/repos/${owner}/${repo}`);
  if (!response.ok) {
    throw new Error('Failed to fetch repository');
  }
  return response.json();
}

/**
 * Fetch contributors
 */
export async function fetchContributors(owner: string, repo: string) {
  const response = await fetch(`${API_BASE_URL}/github/repos/${owner}/${repo}/contributors`);
  if (!response.ok) {
    throw new Error('Failed to fetch contributors');
  }
  return response.json();
}

/**
 * Generate AI code review for a PR
 */
export async function generateAIReview(owner: string, repo: string, pullNumber: number) {
  const response = await fetch(`${API_BASE_URL}/ai/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, repo, pullNumber })
  });
  if (!response.ok) {
    throw new Error('Failed to generate AI review');
  }
  return response.json();
}

/**
 * Generate AI review from raw diff
 */
export async function generateAIReviewFromDiff(title: string, description: string, diff: string) {
  const response = await fetch(`${API_BASE_URL}/ai/review-diff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, diff })
  });
  if (!response.ok) {
    throw new Error('Failed to generate AI review');
  }
  return response.json();
}

/**
 * Get team insights from AI
 */
export async function fetchTeamInsights(metrics: any) {
  const response = await fetch(`${API_BASE_URL}/ai/team-insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metrics })
  });
  if (!response.ok) {
    throw new Error('Failed to fetch team insights');
  }
  return response.json();
}

/**
 * Summarize PR activity
 */
export async function summarizeActivity(owner: string, repo: string) {
  const response = await fetch(`${API_BASE_URL}/ai/summarize-activity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, repo })
  });
  if (!response.ok) {
    throw new Error('Failed to summarize activity');
  }
  return response.json();
}

// ================= JIRA API =================

/**
 * Fetch all Jira projects
 */
export async function fetchJiraProjects() {
  const response = await fetch(`${API_BASE_URL}/jira/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch Jira projects');
  }
  return response.json();
}

/**
 * Fetch issues for a Jira project
 */
export async function fetchJiraIssues(projectKey: string) {
  const response = await fetch(`${API_BASE_URL}/jira/projects/${projectKey}/issues`);
  if (!response.ok) {
    throw new Error('Failed to fetch Jira issues');
  }
  return response.json();
}

/**
 * Search Jira issues by JQL
 */
export async function searchJiraIssues(jql: string) {
  const response = await fetch(`${API_BASE_URL}/jira/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jql })
  });
  if (!response.ok) {
    throw new Error('Failed to search Jira issues');
  }
  return response.json();
}
