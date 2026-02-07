import express from 'express';
import aiService from '../services/aiService.js';

const router = express.Router();

// Analyze delivery risk
router.post('/analyze-delivery', async (req, res) => {
    try {
        const { projectData } = req.body;
        const analysis = await aiService.analyzeDeliveryRisk(projectData);
        res.json({ success: true, data: analysis });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Analyze team performance
router.post('/analyze-team', async (req, res) => {
    try {
        const { teamData } = req.body;
        const analysis = await aiService.analyzeTeamPerformance(teamData);
        res.json({ success: true, data: analysis });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Analyze costs
router.post('/analyze-costs', async (req, res) => {
    try {
        const { costData } = req.body;
        const analysis = await aiService.analyzeCosts(costData);
        res.json({ success: true, data: analysis });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generate executive summary
router.post('/executive-summary', async (req, res) => {
    try {
        const { allData } = req.body;
        const summary = await aiService.generateExecutiveSummary(allData);
        res.json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ask anything - chat with data
router.post('/ask', async (req, res) => {
    try {
        const { question, context } = req.body;
        if (!question) {
            return res.status(400).json({ success: false, error: 'Question is required' });
        }
        const response = await aiService.askAnything(question, context || {});
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export { router as aiRouter };
