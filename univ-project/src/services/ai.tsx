import { OpenAI } from 'openai';

interface ChatCompletionOptions {
  messages: any[];
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
}

const client = new OpenAI({
  apiKey: import.meta.env.VITE_KLUSTERAI_API_KEY,
  baseURL: 'https://api.kluster.ai/v1',
  dangerouslyAllowBrowser: true,
});

export const chatCompletion = async ({
  messages,
  onChunk,
  signal
}: ChatCompletionOptions) => {
  try {
    const response = await fetch('https://api.kluster.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_KLUSTERAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3-0324',
        messages: [
          ...messages,
          { 
            role: 'system', 
            content: `Keep responses focused on programming. Use emojis and friendly tone.`
          }
        ],
        stream: true,
        temperature: 0.6,
        max_tokens: 4000
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to read response stream');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Process each complete line
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data:') && !line.includes('[DONE]')) {
          try {
            const data = JSON.parse(line.substring(5));
            if (data.choices?.[0]?.delta?.content) {
              onChunk(data.choices[0].delta.content);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    }
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      throw error;
    }
  }
};

export const generateChallengeHint = async (question: string, options: string[]) => {
  try {
    const completion = await client.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-V3-0324',
      messages: [
        {
          role: 'system',
          content: `Provide a concise hint for this programming challenge. 
          Focus on key concepts and common pitfalls. 
          Keep it under 2 sentences. Never reveal the answer directly.`
        },
        {
          role: 'user',
          content: `Challenge: ${question}\nOptions: ${options.join(', ')}`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('AI Hint Error:', error);
    throw error;
  }
};