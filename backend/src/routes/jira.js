import express from 'express';
import * as jiraService from '../services/jiraService.js';

const router = express.Router();

/**
 * GET /api/jira/projects
 * Get all projects
 */
router.get('/projects', async (req, res) => {
  try {
    const data = await jiraService.getAllProjects();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/jira/projects/:projectKey
 * Get project details
 */
router.get('/projects/:projectKey', async (req, res) => {
  try {
    const { projectKey } = req.params;
    const data = await jiraService.getProject(projectKey);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/jira/projects/:projectKey/issues
 * Get issues for a project
 */
router.get('/projects/:projectKey/issues', async (req, res) => {
  try {
    const { projectKey } = req.params;
    const { maxResults = 50 } = req.query;
    const data = await jiraService.getIssues(projectKey, parseInt(maxResults));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/jira/boards/:boardId/sprints
 * Get active sprints for a board
 */
router.get('/boards/:boardId/sprints', async (req, res) => {
  try {
    const { boardId } = req.params;
    const data = await jiraService.getActiveSprints(parseInt(boardId));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/jira/sprints/:sprintId/issues
 * Get issues in a sprint
 */
router.get('/sprints/:sprintId/issues', async (req, res) => {
  try {
    const { sprintId } = req.params;
    const data = await jiraService.getSprintIssues(parseInt(sprintId));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/jira/issues/:issueKey
 * Get single issue
 */
router.get('/issues/:issueKey', async (req, res) => {
  try {
    const { issueKey } = req.params;
    const data = await jiraService.getIssue(issueKey);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/jira/search
 * Search issues by JQL
 */
router.post('/search', async (req, res) => {
  try {
    const { jql, maxResults = 50 } = req.body;
    const data = await jiraService.searchIssues(jql, maxResults);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
