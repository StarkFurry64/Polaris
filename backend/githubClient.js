import fetch from "node-fetch";

const GITHUB_API = "https://api.github.com";

export async function fetchRepos() {
    const res = await fetch(
        `https://api.github.com/users/${process.env.GITHUB_OWNER}/repos?per_page=100`,
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        });

    if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
    }

    const repos = await res.json();

    // Filter to only essential fields (STEP 3)
    return repos.map(repo => ({
        name: repo.name,
        full_name: repo.full_name,
        updated_at: repo.updated_at,
        private: repo.private
    }));
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

/**
 * Get a contributor's email from their commit history
 * GitHub commits contain the author's email address
 */
export async function fetchContributorEmail(repo, username) {
    try {
        // Fetch commits by this author
        const res = await fetch(
            `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${repo}/commits?author=${username}&per_page=10`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        if (!res.ok) {
            return null;
        }

        const commits = await res.json();

        if (commits && commits.length > 0) {
            // Get email from the first commit's author
            const email = commits[0]?.commit?.author?.email;

            // Filter out GitHub's no-reply emails if possible
            if (email && !email.includes('noreply.github.com')) {
                return email;
            }

            // Try to find a non-noreply email in other commits
            for (const commit of commits) {
                const authorEmail = commit?.commit?.author?.email;
                if (authorEmail && !authorEmail.includes('noreply.github.com')) {
                    return authorEmail;
                }
            }

            // If all emails are noreply, return the first one anyway
            return commits[0]?.commit?.author?.email || null;
        }

        return null;
    } catch (error) {
        console.error(`Failed to fetch email for ${username}:`, error);
        return null;
    }
}
