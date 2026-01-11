
/**
 * PURE JAVASCRIPT / TYPESCRIPT SERVICE
 * - NO npm packages
 * - NO @google/genai SDK
 * - Native fetch API only
 */

/**
 * Sends a prompt to the Google Gemini API using native REST.
 * Compatible with Browser, Node.js (v18+), and Vercel.
 * 
 * @param prompt - The user input text
 * @returns The generated text from Gemini
 */
export async function sendPrompt(prompt: string): Promise<string> {
  // Using process.env.API_KEY as per system requirements, 
  // which corresponds to the GEMINI_API_KEY requested by the user.
  const apiKey = process.env.API_KEY;
  
  // Model selection: Following system recommendation for speed/efficiency
  const model = 'gemini-3-flash-preview';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  if (!apiKey) {
    throw new Error('API Key is missing. Ensure process.env.API_KEY is configured.');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Gemini API Error (${response.status}): ${errorBody.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    // Safe Response Parsing
    // We check every level to ensure we don't hit "undefined" errors
    if (
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text
    ) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('Malformed response received from Gemini API');
  } catch (error) {
    console.error('Gemini Service Failure:', error);
    throw error instanceof Error ? error : new Error('An unknown error occurred during API call');
  }
}
