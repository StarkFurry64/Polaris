import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Fetch Jira issues with only essential fields:
 * - Issue Key (POL-123)
 * - Issue Type (Task / Bug)
 * - Status (To Do / In Progress / Done)
 * - Assignee
 * - Updated Date
 */
export async function fetchJiraIssues() {
    const baseUrl = process.env.JIRA_BASE_URL;
    const projectKey = process.env.JIRA_PROJECT_KEY;
    const email = process.env.JIRA_EMAIL;
    const apiToken = process.env.JIRA_API_TOKEN;

    if (!baseUrl || !projectKey || !email || !apiToken) {
        throw new Error("Missing Jira configuration in .env");
    }

    const jql = `project=${projectKey} ORDER BY updated DESC`;
    // Fetch all important fields including summary
    const fields = "summary,issuetype,status,priority,assignee,labels,updated,created";

    // Using new /search/jql endpoint (old /search was deprecated)
    const url = `${baseUrl}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&fields=${fields}&maxResults=100`;

    const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");

    const res = await fetch(url, {
        headers: {
            Authorization: `Basic ${auth}`,
            Accept: "application/json"
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Jira API Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    if (!data.issues) {
        return [];
    }

    return data.issues.map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        type: issue.fields.issuetype?.name,
        status: issue.fields.status?.name,
        priority: issue.fields.priority?.name || 'Medium',
        assignee: issue.fields.assignee?.displayName ?? "Unassigned",
        labels: issue.fields.labels || [],
        updated: issue.fields.updated,
        created: issue.fields.created
    }));
}
