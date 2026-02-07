import OpenAI from 'openai';

// Featherless.ai is OpenAI-compatible
// Using DeepSeek-V3-0324 for code review and analysis
const FEATHERLESS_BASE_URL = 'https://api.featherless.ai/v1';
const MODEL = 'deepseek-ai/DeepSeek-V3-0324';

let llmClient = null;

function getLLM() {
  if (!llmClient) {
    if (!process.env.FEATHERLESS_API_KEY) {
      throw new Error('FEATHERLESS_API_KEY is not set. Please add it to your .env file.');
    }
    llmClient = new OpenAI({ 
      apiKey: process.env.FEATHERLESS_API_KEY,
      baseURL: FEATHERLESS_BASE_URL
    });
  }
  return llmClient;
}

/**
 * Generate AI code review for a PR
 */
export async function generateCodeReview(prTitle, prDescription, diffContent) {
  const prompt = `You are an expert code reviewer. Analyze this PR diff and provide a comprehensive review.

PR Title: ${prTitle}
PR Description: ${prDescription || 'No description provided'}

Diff:
\`\`\`diff
${diffContent.slice(0, 8000)}
\`\`\`

Provide your review in the following JSON format:
{
  "summary": "2-3 sentence summary of what this PR does",
  "issues": [
    {"severity": "critical|warning|info", "description": "...", "line": "optional line reference"}
  ],
  "suggestions": [
    {"type": "performance|security|style|logic", "description": "..."}
  ],
  "complexityScore": 1-10,
  "estimatedReviewTime": "X minutes",
  "overallAssessment": "approve|request_changes|needs_discussion"
}`;

  const response = await getLLM().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are an expert code reviewer. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 2000
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch {
    return {
      summary: response.choices[0].message.content,
      issues: [],
      suggestions: [],
      complexityScore: 5,
      estimatedReviewTime: '10 minutes',
      overallAssessment: 'needs_discussion'
    };
  }
}

/**
 * Generate team insights from metrics
 */
export async function generateTeamInsights(metricsData) {
  const prompt = `Analyze these engineering team metrics and provide actionable insights:

${JSON.stringify(metricsData, null, 2)}

Provide your analysis in JSON format:
{
  "healthScore": 1-100,
  "topIssues": ["issue1", "issue2", "issue3"],
  "recommendations": ["recommendation1", "recommendation2"],
  "bottlenecks": [{"area": "...", "severity": "high|medium|low", "suggestion": "..."}],
  "positives": ["what the team is doing well"]
}`;

  const response = await getLLM().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are an engineering team consultant. Provide actionable insights.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.5,
    max_tokens: 1500
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch {
    return { healthScore: 70, topIssues: [], recommendations: [], bottlenecks: [], positives: [] };
  }
}

/**
 * Summarize PR activity
 */
export async function summarizePRActivity(prs) {
  const prSummary = prs.slice(0, 10).map(pr => ({
    title: pr.title,
    state: pr.state,
    author: pr.user?.login,
    additions: pr.additions,
    deletions: pr.deletions
  }));

  const prompt = `Summarize this PR activity in 2-3 sentences for a team standup:
${JSON.stringify(prSummary, null, 2)}`;

  const response = await getLLM().chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 200
  });

  return response.choices[0].message.content;
}
