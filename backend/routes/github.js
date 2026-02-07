import express from 'express';
import githubService from '../services/githubService.js';

const router = express.Router();

// Get authenticated user
router.get('/user', async (req, res) => {
    try {
        const user = await githubService.getUser();
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get repositories
router.get('/repos', async (req, res) => {
    try {
        const { perPage = 30 } = req.query;
        const repos = await githubService.getRepositories(parseInt(perPage));
        res.json({ success: true, data: repos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get commits for a repo
router.get('/repos/:owner/:repo/commits', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const { perPage = 30 } = req.query;
        const commits = await githubService.getCommits(owner, repo, parseInt(perPage));
        res.json({ success: true, data: commits });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get pull requests for a repo
router.get('/repos/:owner/:repo/pulls', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const { state = 'all', perPage = 30 } = req.query;
        const prs = await githubService.getPullRequests(owner, repo, state, parseInt(perPage));
        res.json({ success: true, data: prs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get contributors for a repo
router.get('/repos/:owner/:repo/contributors', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const contributors = await githubService.getContributors(owner, repo);
        res.json({ success: true, data: contributors });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get issues for a repo with flagging
router.get('/repos/:owner/:repo/issues', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const { state = 'all', perPage = 50 } = req.query;
        const issues = await githubService.getIssues(owner, repo, state, parseInt(perPage));

        // Add summary stats
        const stats = {
            total: issues.length,
            open: issues.filter(i => i.state === 'open').length,
            closed: issues.filter(i => i.state === 'closed').length,
            bugs: issues.filter(i => i.isBug).length,
            enhancements: issues.filter(i => i.isEnhancement).length,
            priority: issues.filter(i => i.isPriority).length,
            stale: issues.filter(i => i.isStale && i.state === 'open').length,
            unassigned: issues.filter(i => !i.assignee && i.state === 'open').length
        };

        res.json({ success: true, data: issues, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get PR metrics for a repo
router.get('/repos/:owner/:repo/pr-metrics', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const prs = await githubService.getPullRequests(owner, repo, 'all', 100);
        const metrics = githubService.calculatePRMetrics(prs);
        res.json({ success: true, data: metrics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get deployment frequency for a repo
router.get('/repos/:owner/:repo/deployment-frequency', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const { days = 30 } = req.query;
        const commits = await githubService.getCommits(owner, repo, 100);
        const frequency = githubService.calculateDeploymentFrequency(commits, parseInt(days));
        res.json({ success: true, data: frequency });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get full repo analytics
router.get('/repos/:owner/:repo/analytics', async (req, res) => {
    try {
        const { owner, repo } = req.params;

        const [commits, prs, contributors] = await Promise.all([
            githubService.getCommits(owner, repo, 100),
            githubService.getPullRequests(owner, repo, 'all', 100),
            githubService.getContributors(owner, repo)
        ]);

        const analytics = {
            prMetrics: githubService.calculatePRMetrics(prs),
            deploymentFrequency: githubService.calculateDeploymentFrequency(commits, 30),
            contributionDistribution: githubService.getContributionDistribution(commits),
            contributors: contributors.slice(0, 10),
            commitCount: commits.length,
            prCount: prs.length
        };

        res.json({ success: true, data: analytics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get language distribution across all repos
router.get('/language-distribution', async (req, res) => {
    try {
        const repos = await githubService.getRepositories(50);
        const distribution = githubService.getLanguageDistribution(repos);
        res.json({ success: true, data: distribution });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export { router as githubRouter };
