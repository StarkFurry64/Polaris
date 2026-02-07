import express from 'express';
import * as githubService from '../services/githubService.js';
import { calculatePRMetrics, calculateAuthorMetrics, identifyBlockedPRs } from '../utils/metrics.js';

const router = express.Router();

/**
 * GET /api/metrics/dashboard/:owner/:repo
 * Get all dashboard metrics for a repository
 */
router.get('/dashboard/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const [repoData, prs, contributors] = await Promise.all([
      githubService.getRepository(owner, repo),
      githubService.getPullRequests(owner, repo, 'all', 100),
      githubService.getContributors(owner, repo)
    ]);

    const prMetrics = calculatePRMetrics(prs);
    const authorMetrics = calculateAuthorMetrics(prs);
    const blockedPRs = identifyBlockedPRs(prs);

    // Calculate trends (last 7 days vs previous 7 days)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentPRs = prs.filter(pr => new Date(pr.created_at) > weekAgo);
    const previousPRs = prs.filter(pr => {
      const created = new Date(pr.created_at);
      return created > twoWeeksAgo && created <= weekAgo;
    });

    res.json({
      repository: {
        name: repoData.full_name,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        defaultBranch: repoData.default_branch
      },
      metrics: prMetrics,
      trends: {
        prsThisWeek: recentPRs.length,
        prsLastWeek: previousPRs.length,
        trend: recentPRs.length - previousPRs.length
      },
      authorMetrics: authorMetrics.slice(0, 10),
      blockedPRs,
      topContributors: contributors.slice(0, 5).map(c => ({
        login: c.login,
        avatar: c.avatar_url,
        contributions: c.contributions
      })),
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/metrics/velocity/:owner/:repo
 * Get velocity metrics (PRs merged per week)
 */
router.get('/velocity/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const prs = await githubService.getPullRequests(owner, repo, 'closed', 100);
    
    const mergedPRs = prs.filter(pr => pr.merged_at);
    
    // Group by week
    const weeklyVelocity = {};
    mergedPRs.forEach(pr => {
      const merged = new Date(pr.merged_at);
      const weekStart = new Date(merged);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyVelocity[weekKey]) {
        weeklyVelocity[weekKey] = { week: weekKey, count: 0, additions: 0, deletions: 0 };
      }
      weeklyVelocity[weekKey].count++;
      weeklyVelocity[weekKey].additions += pr.additions || 0;
      weeklyVelocity[weekKey].deletions += pr.deletions || 0;
    });

    res.json({
      repository: `${owner}/${repo}`,
      weeklyVelocity: Object.values(weeklyVelocity).sort((a, b) => a.week.localeCompare(b.week)),
      totalMerged: mergedPRs.length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
