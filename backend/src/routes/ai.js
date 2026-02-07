import express from 'express';
import * as llmService from '../services/llmService.js';
import * as githubService from '../services/githubService.js';

const router = express.Router();

/**
 * POST /api/ai/review
 * Generate AI code review for a PR
 */
router.post('/review', async (req, res) => {
  try {
    const { owner, repo, pullNumber } = req.body;
    
    // Fetch PR data from GitHub
    const prs = await githubService.getPullRequests(owner, repo, 'all', 100);
    const pr = prs.find(p => p.number === parseInt(pullNumber));
    
    if (!pr) {
      return res.status(404).json({ error: 'PR not found' });
    }

    const files = await githubService.getPRFiles(owner, repo, parseInt(pullNumber));
    
    // Create diff content from files
    const diffContent = files.map(f => 
      `File: ${f.filename}\nStatus: ${f.status}\nChanges: +${f.additions} -${f.deletions}\n${f.patch || ''}`
    ).join('\n\n');

    const review = await llmService.generateCodeReview(
      pr.title,
      pr.body,
      diffContent
    );

    res.json({
      pullRequest: {
        number: pr.number,
        title: pr.title,
        author: pr.user?.login,
        url: pr.html_url
      },
      review,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/review-diff
 * Generate AI code review from raw diff
 */
router.post('/review-diff', async (req, res) => {
  try {
    const { title, description, diff } = req.body;
    
    const review = await llmService.generateCodeReview(title, description, diff);
    
    res.json({
      review,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/team-insights
 * Generate AI insights from team metrics
 */
router.post('/team-insights', async (req, res) => {
  try {
    const { metrics } = req.body;
    
    const insights = await llmService.generateTeamInsights(metrics);
    
    res.json({
      insights,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/summarize-activity
 * Summarize PR activity
 */
router.post('/summarize-activity', async (req, res) => {
  try {
    const { owner, repo } = req.body;
    
    const prs = await githubService.getPullRequests(owner, repo, 'all', 20);
    const summary = await llmService.summarizePRActivity(prs);
    
    res.json({
      repository: `${owner}/${repo}`,
      summary,
      prCount: prs.length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
