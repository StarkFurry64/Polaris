import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Helper function to call Gemini AI
async function callGeminiAI(systemPrompt, userPrompt) {
    const prompt = `${systemPrompt}\n\n${userPrompt}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}

// Analyze delivery risk
export async function analyzeDeliveryRisk(projectData) {
    const systemPrompt = 'You are an AI engineering intelligence analyst. Always respond with valid JSON only, no markdown.';
    const userPrompt = `Analyze this project data and provide delivery risk assessment.

Project Data:
${JSON.stringify(projectData, null, 2)}

Provide JSON with: riskScore (0-100), riskLevel (low/medium/high/critical), keyRisks (array), recommendations (array), predictedDeliveryConfidence (percentage), summary (2-3 sentences).`;

    try {
        const text = await callGeminiAI(systemPrompt, userPrompt);
        const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error('Gemini AI error:', error.message);
        return {
            riskScore: 0,
            riskLevel: 'unknown',
            keyRisks: ['Unable to analyze - check API key'],
            recommendations: [],
            summary: 'Analysis unavailable'
        };
    }
}

// Analyze team performance
export async function analyzeTeamPerformance(teamData) {
    const systemPrompt = 'You are an AI engineering analyst. Always respond with valid JSON only.';
    const userPrompt = `Analyze this team data and provide workforce insights.

Team Data:
${JSON.stringify(teamData, null, 2)}

Provide JSON with: productivityScore (0-100), collaborationScore (0-100), burnoutRisk (low/medium/high), skillGaps (array), topPerformers (array), bottlenecks (array), actionItems (array).`;

    try {
        const text = await callGeminiAI(systemPrompt, userPrompt);
        const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error('Gemini AI error:', error.message);
        return { productivityScore: 0, collaborationScore: 0, burnoutRisk: 'unknown' };
    }
}

// Analyze costs
export async function analyzeCosts(costData) {
    const systemPrompt = 'You are an AI cost analyst. Always respond with valid JSON only.';
    const userPrompt = `Analyze engineering cost data.

Cost Data:
${JSON.stringify(costData, null, 2)}

Provide JSON with: efficiencyScore (0-100), costTrend (increasing/stable/decreasing), savingsOpportunities (array), budgetStatus (on-track/at-risk/over-budget), executiveSummary (string).`;

    try {
        const text = await callGeminiAI(systemPrompt, userPrompt);
        const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error('Gemini AI error:', error.message);
        return { efficiencyScore: 0, budgetStatus: 'unknown' };
    }
}

// Generate executive summary
export async function generateExecutiveSummary(allData) {
    const systemPrompt = 'You are an AI executive analyst. Always respond with valid JSON only.';
    const userPrompt = `Generate an executive summary for this engineering data.

Data:
${JSON.stringify(allData, null, 2)}

Provide JSON with: headline (one sentence), healthScore (0-100), keyMetrics (array of {metric, value, trend}), criticalInsights (top 3 insights), strategicRecommendations (array), risks (array).`;

    try {
        const text = await callGeminiAI(systemPrompt, userPrompt);
        const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error('Gemini AI error:', error.message);
        return { headline: 'Analysis unavailable', healthScore: 0 };
    }
}

// Chat with data - grounded to only use provided context
export async function askAnything(question, context) {
    const systemPrompt = `You are Polaris AI, an engineering intelligence assistant.

IMPORTANT RULES:
1. Answer ONLY using the Jira and GitHub data provided below.
2. Do NOT assume or use external information.
3. If the data doesn't contain the answer, say "I don't have that information in the current data."
4. Be specific with numbers and reference issue keys (e.g., POL-123) when applicable.
5. Keep answers concise and actionable.`;

    const userPrompt = `Context (Jira/GitHub data):
${JSON.stringify(context, null, 2)}

Question: ${question}`;

    try {
        const answer = await callGeminiAI(systemPrompt, userPrompt);
        return {
            answer,
            model: 'gemini-2.0-flash',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Gemini AI error:', error.message);
        return {
            answer: `Error: ${error.message}`,
            model: 'gemini-2.0-flash',
            timestamp: new Date().toISOString(),
            error: true
        };
    }
}

export default {
    analyzeDeliveryRisk,
    analyzeTeamPerformance,
    analyzeCosts,
    generateExecutiveSummary,
    askAnything
};
