import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Call Groq AI with a prompt
 * @param {string} systemPrompt - System instructions
 * @param {string} userPrompt - User question with context
 * @returns {Promise<string>} - AI response
 */
export async function askGroq(systemPrompt, userPrompt) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
            model: 'llama-3.3-70b-versatile', // Updated to supported model
            temperature: 0.3, // Lower temperature for more factual responses
            max_tokens: 1024
        });

        return chatCompletion.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
        console.error('Groq API error:', error.message);
        throw new Error(`Failed to call Groq API: ${error.message}`);
    }
}
