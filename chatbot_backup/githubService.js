import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API = 'https://api.github.com';

// Make authenticated GitHub API request
async function githubRequest(endpoint, method = 'GET') {
    const url = `${GITHUB_API}${endpoint}`;

    const response = await fetch(url, {
        method,
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
}

// Get authenticated user
export async function getUser() {
    return githubRequest('/user');
}

// Get user's repositories
export async function getRepositories(perPage = 30) {
    const repos = await githubRequest(`/user/repos?sort=updated&per_page=${perPage}`);
    return repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        private: repo.private,
        description: repo.description,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        openIssuesCount: repo.open_issues_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        defaultBranch: repo.default_branch,
        url: repo.html_url
    }));
}

// Get commits for a repository
export async function getCommits(owner, repo, perPage = 30) {
    const commits = await githubRequest(`/repos/${owner}/${repo}/commits?per_page=${perPage}`);
    return commits.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        authorEmail: commit.commit.author.email,
        date: commit.commit.author.date,
        url: commit.html_url,
        additions: commit.stats?.additions || 0,
        deletions: commit.stats?.deletions || 0
    }));
}

// Get pull requests for a repository
export async function getPullRequests(owner, repo, state = 'all', perPage = 30) {
    const prs = await githubRequest(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=${perPage}`);
    return prs.map(pr => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        user: pr.user.login,
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
        closedAt: pr.closed_at,
        mergedAt: pr.merged_at,
        draft: pr.draft,
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
        url: pr.html_url,
        labels: pr.labels.map(l => l.name)
    }));
}

// Get contributors for a repository
export async function getContributors(owner, repo) {
    const contributors = await githubRequest(`/repos/${owner}/${repo}/contributors`);
    return contributors.map(c => ({
        login: c.login,
        contributions: c.contributions,
        avatarUrl: c.avatar_url,
        url: c.html_url
    }));
}

// Calculate PR metrics
export function calculatePRMetrics(pullRequests) {
    const merged = pullRequests.filter(pr => pr.mergedAt);
    const open = pullRequests.filter(pr => pr.state === 'open');
    const closed = pullRequests.filter(pr => pr.state === 'closed' && !pr.mergedAt);

    // Calculate average time to merge
    const mergeTimesInHours = merged
        .filter(pr => pr.createdAt && pr.mergedAt)
        .map(pr => {
            const created = new Date(pr.createdAt);
            const mergedDate = new Date(pr.mergedAt);
            return (mergedDate - created) / (1000 * 60 * 60);
        });

    const avgMergeTime = mergeTimesInHours.length > 0
        ? mergeTimesInHours.reduce((a, b) => a + b, 0) / mergeTimesInHours.length
        : 0;

    // Calculate review time (created to closed/merged)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const mergedLastWeek = merged.filter(pr => new Date(pr.mergedAt) > lastWeek).length;

    return {
        total: pullRequests.length,
        open: open.length,
        merged: merged.length,
        closed: closed.length,
        avgMergeTimeHours: Math.round(avgMergeTime * 10) / 10,
        weeklyMergeRate: mergedLastWeek,
        mergeRate: Math.round((merged.length / (merged.length + closed.length)) * 100) || 0
    };
}

// Calculate deployment frequency (commits per day)
export function calculateDeploymentFrequency(commits, days = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const recentCommits = commits.filter(c => new Date(c.date) > cutoff);
    return {
        totalCommits: recentCommits.length,
        perDay: Math.round((recentCommits.length / days) * 10) / 10,
        perWeek: Math.round((recentCommits.length / (days / 7)) * 10) / 10
    };
}

// Calculate contribution distribution
export function getContributionDistribution(commits) {
    const distribution = {};
    commits.forEach(commit => {
        const author = commit.author || 'Unknown';
        distribution[author] = (distribution[author] || 0) + 1;
    });
    return Object.entries(distribution)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

// Get language distribution across repos
export function getLanguageDistribution(repos) {
    const languages = {};
    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });
    return Object.entries(languages)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Build structured repository context for the chatbot
 * This function fetches and normalizes GitHub data for a specific repository
 * 
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} Structured context object
 */
export async function buildRepoContext(owner, repo) {
    try {
        // Fetch all GitHub data in parallel
        const [commits, prs, contributors, readme, repoTree] = await Promise.all([
            getCommits(owner, repo, 30).catch(e => { console.error('Commits error:', e.message); return []; }),
            getPullRequests(owner, repo, 'all', 30).catch(e => { console.error('PRs error:', e.message); return []; }),
            getContributors(owner, repo).catch(e => { console.error('Contributors error:', e.message); return []; }),
            import('../githubClient.js').then(m => m.fetchReadme(repo)).catch(e => { console.error('README error:', e.message); return null; }),
            import('../githubClient.js').then(m => m.fetchRepoTree(repo)).catch(e => { console.error('Tree error:', e.message); return { tree: [] }; })
        ]);

        // Get list of important files from tree
        const importantFiles = repoTree.tree
            ?.filter(item => item.type === 'blob')
            ?.filter(item => {
                const path = item.path.toLowerCase();
                return path.includes('readme') ||
                    path.includes('package.json') ||
                    path.includes('config') ||
                    path.endsWith('.md');
            })
            ?.slice(0, 5) // Limit to 5 most important files
            ?.map(item => item.path) || [];

        // Normalize and structure the data
        const context = {
            repository: `${owner}/${repo}`,
            summary: {
                totalCommits: commits.length,
                totalPRs: prs.length,
                openPRs: prs.filter(pr => pr.state === 'open').length,
                closedPRs: prs.filter(pr => pr.state === 'closed').length,
                mergedPRs: prs.filter(pr => pr.mergedAt).length,
                totalContributors: contributors.length
            },
            recentCommits: commits.slice(0, 20).map(c => ({
                sha: c.sha?.substring(0, 7),
                author: c.author || 'Unknown',
                message: c.message || 'No message',
                date: c.date,
                additions: c.additions,
                deletions: c.deletions
            })),
            pullRequests: prs.slice(0, 15).map(pr => ({
                number: pr.number,
                title: pr.title,
                state: pr.state,
                author: pr.user || 'Unknown',
                createdAt: pr.createdAt,
                updatedAt: pr.updatedAt,
                mergedAt: pr.mergedAt,
                additions: pr.additions,
                deletions: pr.deletions,
                changedFiles: pr.changedFiles
            })),
            contributors: contributors.slice(0, 10).map(c => ({
                username: c.login,
                contributions: c.contributions,
                profileUrl: c.url
            })),
            files: {
                readme: readme ? readme.substring(0, 3000) : 'No README file found in this repository.',
                importantFiles: importantFiles
            }
        };

        return context;
    } catch (error) {
        console.error(`Failed to build repo context for ${owner}/${repo}:`, error.message);
        throw new Error(`Unable to fetch repository data for ${owner}/${repo}`);
    }
}

export default {
    getUser,
    getRepositories,
    getCommits,
    getPullRequests,
    getContributors,
    calculatePRMetrics,
    calculateDeploymentFrequency,
    getContributionDistribution,
    getLanguageDistribution,
    buildRepoContext
};
