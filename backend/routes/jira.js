import express from 'express';
import jiraService from '../services/jiraService.js';

const router = express.Router();

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await jiraService.getProjects();
        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get issues for a project
router.get('/projects/:projectKey/issues', async (req, res) => {
    try {
        const { projectKey } = req.params;
        const { maxResults = 50 } = req.query;
        const issues = await jiraService.getIssues(projectKey, parseInt(maxResults));
        res.json({ success: true, data: issues });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get velocity metrics for a project
router.get('/projects/:projectKey/velocity', async (req, res) => {
    try {
        const { projectKey } = req.params;
        const issues = await jiraService.getIssues(projectKey, 100);
        const velocity = jiraService.calculateVelocity(issues);
        res.json({ success: true, data: velocity });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get team workload
router.get('/projects/:projectKey/workload', async (req, res) => {
    try {
        const { projectKey } = req.params;
        const issues = await jiraService.getIssues(projectKey, 100);
        const workload = jiraService.getTeamWorkload(issues);
        res.json({ success: true, data: workload });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get issue distribution
router.get('/projects/:projectKey/distribution', async (req, res) => {
    try {
        const { projectKey } = req.params;
        const issues = await jiraService.getIssues(projectKey, 100);
        const distribution = jiraService.getIssueDistribution(issues);
        res.json({ success: true, data: distribution });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get skill requirements
router.get('/projects/:projectKey/skills', async (req, res) => {
    try {
        const { projectKey } = req.params;
        const issues = await jiraService.getIssues(projectKey, 100);
        const skills = jiraService.extractSkillRequirements(issues);
        res.json({ success: true, data: skills });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get full project analytics
router.get('/projects/:projectKey/analytics', async (req, res) => {
    try {
        const { projectKey } = req.params;
        const issues = await jiraService.getIssues(projectKey, 100);

        const analytics = {
            velocity: jiraService.calculateVelocity(issues),
            distribution: jiraService.getIssueDistribution(issues),
            workload: jiraService.getTeamWorkload(issues),
            skills: jiraService.extractSkillRequirements(issues),
            issueCount: issues.length
        };

        res.json({ success: true, data: analytics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export { router as jiraRouter };
