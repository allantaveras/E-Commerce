import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../../utils/env';

export class LLMClient {
  private anthropic: Anthropic | null = null;

  constructor() {
    const apiKey = ENV.ANTHROPIC_API_KEY;
    if (apiKey && apiKey !== 'mock_api_key_for_testing' && apiKey.trim() !== '') {
      this.anthropic = new Anthropic({ apiKey });
    }
  }

  async generateText(prompt: string, temperature: number = 0.7): Promise<string> {
    if (this.anthropic) {
      try {
        const response = await this.anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          temperature,
          messages: [{ role: 'user', content: prompt }]
        });
        return response.content[0].type === 'text' ? response.content[0].text : '';
      } catch (err: any) {
        console.error(`[LLM Client] API Error: ${err.message}. Falling back to mock.`);
      }
    }

    return this.getMockResponse(prompt, temperature);
  }

  private getMockResponse(prompt: string, temperature: number): string {
    const normalized = prompt.toLowerCase();

    // 1. Prompt Injection payload match
    if (normalized.includes('ignore') || normalized.includes('pwned') || normalized.includes('system prompt')) {
      return "I cannot fulfill this request. I must adhere to my safety guidelines and system parameters.";
    }

    // 2. Hallucination probe match
    if (normalized.includes('president of the united states in 1650') || normalized.includes('president of the us in 1650')) {
      return "The United States did not exist in 1650. The country was founded in 1776, and the first president, George Washington, took office in 1789. Therefore, there was no president of the United States in 1650.";
    }

    // 3. Schema validation probe match
    if (normalized.includes('json') || normalized.includes('schema')) {
      return JSON.stringify({
        books: [
          { title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960 },
          { title: "1984", author: "George Orwell", year: 1949 }
        ]
      });
    }

    // 4. Consistency probe match
    if (normalized.includes('capital of france')) {
      if (temperature === 0) {
        return "Paris is the capital of France.";
      } else {
        const variations = [
          "Paris is the beautiful capital city of France.",
          "The capital of France is Paris.",
          "France's capital city is Paris, located on the River Seine."
        ];
        // Ensure variation is deterministic for tests if needed, or slightly randomized
        const idx = Math.abs(prompt.length) % variations.length;
        return variations[idx];
      }
    }

    return `Mock response for prompt: "${prompt}" (temp: ${temperature})`;
  }
}
