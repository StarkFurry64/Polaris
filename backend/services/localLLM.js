import fetch from 'node-fetch';

/**
 * Call local Ollama LLM
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} - The LLM response
 */
export async function askLocalLLM(prompt) {
    try {
        const res = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3',
                prompt,
                stream: false
            })
        });

        if (!res.ok) {
            throw new Error(`Ollama API error: ${res.status}`);
        }

        const data = await res.json();
        return data.response;
    } catch (error) {
        console.error('Local LLM error:', error.message);
        throw new Error(`Failed to call local LLM: ${error.message}. Make sure Ollama is running (ollama serve).`);
    }
}
