import { registerAs } from '@nestjs/config';
export default registerAs('ai', () => ({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.AI_MODEL || 'gemini-2.5-flash',
  timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '30000', 10),
}));
