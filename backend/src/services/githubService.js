import { Octokit } from '@octokit/rest';

// Lazy-loaded Octokit client to ensure env vars are loaded
let octokit = null;

function getOctokit() {
  if (!octokit) {
    octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }
  return octokit;
}

/**
 * Get repository information
 */
export async function getRepository(owner, repo) {
  const { data } = await getOctokit().repos.get({ owner, repo });
  return data;
}

/**
 * Get all repositories for a user/org
 */
export async function getUserRepos(owner) {
  const { data } = await getOctokit().repos.listForUser({
    username: owner,
    per_page: 100,
    sort: 'updated',
    direction: 'desc'
  });
  return data.map(repo => ({
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    stargazers_count: repo.stargazers_count,
    language: repo.language,
    updated_at: repo.updated_at
  }));
}

/**
 * Get pull requests with details
 */
export async function getPullRequests(owner, repo, state = 'all', perPage = 30) {
  const { data } = await getOctokit().pulls.list({
    owner,
    repo,
    state,
    per_page: perPage,
    sort: 'updated',
    direction: 'desc'
  });
  return data;
}

/**
 * Get PR reviews
 */
export async function getPRReviews(owner, repo, pullNumber) {
  const { data } = await getOctokit().pulls.listReviews({
    owner,
    repo,
    pull_number: pullNumber
  });
  return data;
}

/**
 * Get PR commits
 */
export async function getPRCommits(owner, repo, pullNumber) {
  const { data } = await getOctokit().pulls.listCommits({
    owner,
    repo,
    pull_number: pullNumber
  });
  return data;
}

/**
 * Get PR diff/files
 */
export async function getPRFiles(owner, repo, pullNumber) {
  const { data } = await getOctokit().pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber
  });
  return data;
}

/**
 * Get repository contributors
 */
export async function getContributors(owner, repo) {
  const { data } = await getOctokit().repos.listContributors({
    owner,
    repo,
    per_page: 30
  });
  return data;
}

/**
 * Get user's recent activity
 */
export async function getUserActivity(username) {
  const { data } = await getOctokit().activity.listEventsForAuthenticatedUser({
    username,
    per_page: 50
  });
  return data;
}
