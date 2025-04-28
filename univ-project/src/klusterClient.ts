// klusterClient.ts
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_KLUSTER_API_KEY, // ✅ Use Vite's syntax
  baseURL: "https://api.kluster.ai/v1", // Kluster's proxy API
});