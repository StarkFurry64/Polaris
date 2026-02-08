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
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            }
        }
    );

    return res.json();
}

// Fetch README file content
export async function fetchReadme(repo) {
    try {
        const res = await fetch(
            `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${repo}/readme`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.raw" // Get raw content
                }
            }
        );

        if (!res.ok) {
            return null; // README doesn't exist
        }

        return await res.text();
    } catch (error) {
        console.error('Error fetching README:', error.message);
        return null;
    }
}

// Fetch specific file content from repository
export async function fetchFileContent(repo, filePath) {
    try {
        const res = await fetch(
            `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${repo}/contents/${filePath}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.raw"
                }
            }
        );

        if (!res.ok) {
            return null;
        }

        return await res.text();
    } catch (error) {
        console.error(`Error fetching file ${filePath}:`, error.message);
        return null;
    }
}

// Fetch repository file tree
export async function fetchRepoTree(repo) {
    try {
        const res = await fetch(
            `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${repo}/git/trees/main?recursive=1`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        if (!res.ok) {
            // Try 'master' branch if 'main' doesn't exist
            const resMaster = await fetch(
                `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${repo}/git/trees/master?recursive=1`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                        Accept: "application/vnd.github+json"
                    }
                }
            );

            if (!resMaster.ok) {
                return { tree: [] };
            }

            return await resMaster.json();
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching repo tree:', error.message);
        return { tree: [] };
    }
}
