import dotenv from 'dotenv';
import { askGroq } from './groqService.js';

// Load environment variables
dotenv.config();

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
export async function askAnything(question, repoContext) {
    const systemPrompt = `You are Polaris AI, an engineering intelligence assistant.

CRITICAL RULES - YOU MUST FOLLOW THESE EXACTLY:
1. Answer using the GitHub repository data provided below.
2. If the repository has minimal data (few commits, no PRs, no README), acknowledge this and provide what information IS available.
3. For questions about purpose/description: If no README exists, say "This repository does not have a README file. Based on the repository name '${repoContext.repository}', it appears to be [make an educated guess from the name]."
4. For questions about activity: Always provide the actual numbers even if they're low (e.g., "This repository has ${repoContext.summary.totalCommits} commit(s)").
5. Be specific with numbers and reference commit SHAs, PR numbers, and contributor names when applicable.
6. Keep answers concise, factual, and actionable.
7. Only refuse to answer if the question is completely unrelated to repository data (e.g., "What is the best programming language?").

REMEMBER: Provide helpful answers based on available data, even if minimal. Don't refuse to answer just because data is limited.`;

    const userPrompt = `GitHub Repository Data:
${JSON.stringify(repoContext, null, 2)}

User Question: ${question}

Answer based on the repository data above. If data is minimal, acknowledge it but still provide what information is available.`;

    try {
        const answer = await askGroq(systemPrompt, userPrompt);
        return {
            answer,
            model: 'llama-3.3-70b-versatile',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Groq API error:', error.message);
        return {
            answer: `Error: ${error.message}. Please check if GROQ_API_KEY is configured in .env file.`,
            model: 'llama-3.3-70b-versatile',
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
