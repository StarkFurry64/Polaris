import express from 'express';
import * as githubService from '../services/githubService.js';
import { calculatePRMetrics, calculateAuthorMetrics, identifyBlockedPRs } from '../utils/metrics.js';

const router = express.Router();

/**
 * GET /api/github/users/:owner/repos
 * Get all repositories for a user/org
 */
router.get('/users/:owner/repos', async (req, res) => {
  try {
    const { owner } = req.params;
    const data = await githubService.getUserRepos(owner);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/github/repos/:owner/:repo
 * Get repository info
 */
router.get('/repos/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const data = await githubService.getRepository(owner, repo);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/github/repos/:owner/:repo/pulls
 * Get pull requests
 */
router.get('/repos/:owner/:repo/pulls', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'all', per_page = 30 } = req.query;
    const data = await githubService.getPullRequests(owner, repo, state, parseInt(per_page));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/github/repos/:owner/:repo/metrics
 * Get calculated PR metrics for a repo
 */
router.get('/repos/:owner/:repo/metrics', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const prs = await githubService.getPullRequests(owner, repo, 'all', 100);
    
    const metrics = calculatePRMetrics(prs);
    const authorMetrics = calculateAuthorMetrics(prs);
    const blockedPRs = identifyBlockedPRs(prs);

    res.json({
      repository: `${owner}/${repo}`,
      generatedAt: new Date().toISOString(),
      metrics,
      authorMetrics,
      blockedPRs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/github/repos/:owner/:repo/pulls/:pull_number/review-data
 * Get PR with review data for AI analysis
 */
router.get('/repos/:owner/:repo/pulls/:pull_number/review-data', async (req, res) => {
  try {
    const { owner, repo, pull_number } = req.params;
    const [files, commits, reviews] = await Promise.all([
      githubService.getPRFiles(owner, repo, parseInt(pull_number)),
      githubService.getPRCommits(owner, repo, parseInt(pull_number)),
      githubService.getPRReviews(owner, repo, parseInt(pull_number))
    ]);

    res.json({ files, commits, reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/github/repos/:owner/:repo/contributors
 * Get repository contributors
 */
router.get('/repos/:owner/:repo/contributors', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const data = await githubService.getContributors(owner, repo);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
