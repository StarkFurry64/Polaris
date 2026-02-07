import fetch from "node-fetch";

const GITHUB_API = "https://api.github.com";

export async function fetchRepositories() {
    const res = await fetch(`${GITHUB_API}/users/${process.env.GITHUB_OWNER}/repos`, {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json"
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch repositories");
    }

    return res.json();
}

export async function fetchCommits(repo) {
    const res = await fetch(
        `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${repo}/commits`,
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            }
        }
    );

    return res.json();
}

export async function fetchPullRequests(repo) {
    const res = await fetch(
        `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${repo}/pulls?state=all`,
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        }
    );

    return res.json();
}

export async function fetchContributors(repo) {
    const res = await fetch(
        `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${repo}/contributors`,
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        }
    );

    return res.json();
}
