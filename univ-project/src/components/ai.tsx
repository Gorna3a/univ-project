import { genkit } from 'genkit';
import deepseek, { deepseekChat } from 'genkitx-deepseek';

const ai = genkit({
  plugins: [deepseek({ apiKey: process.env.DEEPSEEK_API_KEY })],
  // Optionally specify a default model if not provided in generate params:
  model: deepseekChat,
});

const response = await ai.generate({
    model: deepseekChat,
    prompt: 'Tell me a joke!',
  });
  
  console.log(response.text);
  
export default ai;