import fetch from 'node-fetch';

// Lazy loading for env vars - ensures dotenv is loaded first
let config = null;

function getConfig() {
    if (!config) {
        config = {
            jiraUrl: process.env.JIRA_URL || process.env.JIRA_BASE_URL,
            jiraEmail: process.env.JIRA_EMAIL,
            jiraApiToken: process.env.JIRA_API_TOKEN
        };
    }
    return config;
}

// Create base64 auth header for Jira
const getAuthHeader = () => {
    const { jiraEmail, jiraApiToken } = getConfig();
    const credentials = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64');
    return `Basic ${credentials}`;
};

// Make authenticated Jira API request
async function jiraRequest(endpoint, method = 'GET', body = null) {
    const { jiraUrl } = getConfig();
    const url = `${jiraUrl}/rest/api/3${endpoint}`;

    const options = {
        method,
        headers: {
            'Authorization': getAuthHeader(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Jira API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
}

// Get all projects
export async function getProjects() {
    const data = await jiraRequest('/project');
    return data.map(project => ({
        id: project.id,
        key: project.key,
        name: project.name,
        projectTypeKey: project.projectTypeKey,
        avatarUrl: project.avatarUrls?.['48x48']
    }));
}

// Get issues for a project with JQL - using NEW /search/jql endpoint
export async function getIssues(projectKey, maxResults = 50) {
    const jql = `project = ${projectKey} ORDER BY created DESC`;
    // Using the new /search/jql endpoint (old /search was deprecated)
    const data = await jiraRequest(`/search/jql?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&fields=summary,status,priority,issuetype,assignee,reporter,created,updated,resolutiondate,labels,components`);

    return (data.issues || []).map(issue => ({
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status?.name,
        statusCategory: issue.fields.status?.statusCategory?.key,
        priority: issue.fields.priority?.name,
        issueType: issue.fields.issuetype?.name,
        assignee: issue.fields.assignee?.displayName,
        reporter: issue.fields.reporter?.displayName,
        created: issue.fields.created,
        updated: issue.fields.updated,
        resolved: issue.fields.resolutiondate,
        storyPoints: issue.fields.customfield_10016 || null,
        labels: issue.fields.labels || [],
        components: issue.fields.components?.map(c => c.name) || []
    }));
}

// Get sprints for a board
export async function getSprints(boardId) {
    try {
        const data = await jiraRequest(`/board/${boardId}/sprint`);
        return data.values || [];
    } catch (error) {
        console.log('Sprints not available:', error.message);
        return [];
    }
}

// Calculate velocity metrics from issues
export function calculateVelocity(issues) {
    const completed = issues.filter(i => i.status === 'Done' || i.status === 'Closed');
    const inProgress = issues.filter(i => i.status === 'In Progress');
    const todo = issues.filter(i => i.status === 'To Do' || i.status === 'Open');

    // Calculate cycle time (created to resolved)
    const cycleTimesInDays = completed
        .filter(i => i.resolved)
        .map(i => {
            const created = new Date(i.created);
            const resolved = new Date(i.resolved);
            return (resolved - created) / (1000 * 60 * 60 * 24);
        });

    const avgCycleTime = cycleTimesInDays.length > 0
        ? cycleTimesInDays.reduce((a, b) => a + b, 0) / cycleTimesInDays.length
        : 0;

    // Calculate throughput (issues completed per week)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const completedLastWeek = completed.filter(i => new Date(i.resolved) > lastWeek).length;

    return {
        totalIssues: issues.length,
        completed: completed.length,
        inProgress: inProgress.length,
        todo: todo.length,
        avgCycleTimeDays: Math.round(avgCycleTime * 10) / 10,
        weeklyThroughput: completedLastWeek,
        completionRate: issues.length > 0 ? Math.round((completed.length / issues.length) * 100) : 0
    };
}

// Get issue type distribution
export function getIssueDistribution(issues) {
    const distribution = {};
    issues.forEach(issue => {
        const type = issue.issueType || 'Unknown';
        distribution[type] = (distribution[type] || 0) + 1;
    });
    return distribution;
}

// Get team workload by assignee
export function getTeamWorkload(issues) {
    const workload = {};
    issues.forEach(issue => {
        const assignee = issue.assignee || 'Unassigned';
        if (!workload[assignee]) {
            workload[assignee] = { total: 0, completed: 0, inProgress: 0 };
        }
        workload[assignee].total++;
        if (issue.status === 'Done' || issue.status === 'Closed') {
            workload[assignee].completed++;
        } else if (issue.status === 'In Progress') {
            workload[assignee].inProgress++;
        }
    });
    return workload;
}

// Extract skills from labels and components
export function extractSkillRequirements(issues) {
    const skills = {};
    issues.forEach(issue => {
        [...issue.labels, ...issue.components].forEach(skill => {
            skills[skill] = (skills[skill] || 0) + 1;
        });
    });
    return Object.entries(skills)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

export default {
    getProjects,
    getIssues,
    getSprints,
    calculateVelocity,
    getIssueDistribution,
    getTeamWorkload,
    extractSkillRequirements
};
