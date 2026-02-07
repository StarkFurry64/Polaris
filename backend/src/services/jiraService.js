import axios from 'axios';

let jiraClient = null;

function getJiraClient() {
  if (!jiraClient) {
    if (!process.env.JIRA_HOST || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
      throw new Error('Jira credentials not configured. Please set JIRA_HOST, JIRA_EMAIL, and JIRA_API_TOKEN in .env');
    }
    jiraClient = axios.create({
      baseURL: process.env.JIRA_HOST,
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });
  }
  return jiraClient;
}

/**
 * Get all projects
 */
export async function getAllProjects() {
  const { data } = await getJiraClient().get('/rest/api/3/project');
  return data;
}

/**
 * Get project details
 */
export async function getProject(projectKey) {
  const { data } = await getJiraClient().get(`/rest/api/3/project/${projectKey}`);
  return data;
}

/**
 * Get issues for a project
 */
export async function getIssues(projectKey, maxResults = 50) {
  const jql = `project = ${projectKey} ORDER BY updated DESC`;
  const { data } = await getJiraClient().get('/rest/api/3/search/jql', {
    params: { 
      jql, 
      maxResults,
      fields: 'summary,status,issuetype,priority,assignee,created,updated'
    }
  });
  return data.issues || [];
}

/**
 * Get active sprints for a board
 */
export async function getActiveSprints(boardId) {
  const { data } = await getJiraClient().get(`/rest/agile/1.0/board/${boardId}/sprint`, {
    params: { state: 'active' }
  });
  return data.values;
}

/**
 * Get sprint issues
 */
export async function getSprintIssues(sprintId) {
  const { data } = await getJiraClient().get(`/rest/agile/1.0/sprint/${sprintId}/issue`);
  return data.issues;
}

/**
 * Get issue by key
 */
export async function getIssue(issueKey) {
  const { data } = await getJiraClient().get(`/rest/api/3/issue/${issueKey}`);
  return data;
}

/**
 * Search issues by JQL
 */
export async function searchIssues(jql, maxResults = 50) {
  const { data } = await getJiraClient().get('/rest/api/3/search', {
    params: { jql, maxResults }
  });
  return data.issues;
}

/**
 * Get issues linked to a PR (by branch name or PR number in commit)
 */
export async function getIssuesByPRReference(prNumber, branchName) {
  const jql = `text ~ "PR-${prNumber}" OR text ~ "${branchName}"`;
  return searchIssues(jql, 10);
}
