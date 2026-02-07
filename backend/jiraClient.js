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

    const jql = `project=${projectKey}`;
    // Only fetch required fields - no comments, changelogs, attachments
    const fields = "issuetype,status,assignee,updated";

    const url = `${baseUrl}/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=${fields}`;

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
        type: issue.fields.issuetype?.name,
        status: issue.fields.status?.name,
        assignee: issue.fields.assignee?.displayName ?? "Unassigned",
        updated: issue.fields.updated
    }));
}
