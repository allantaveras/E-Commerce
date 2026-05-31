import Anthropic from '@anthropic-ai/sdk';
import { TestCase } from './template';
import { ENV } from '../../utils/env';

/**
 * Communicates with Claude API via Anthropic SDK to parse a plain-text feature description into structured JSON test cases.
 */
export async function generateTestCases(prompt: string): Promise<{ suiteName: string; testCases: TestCase[] }> {
  const apiKey = ENV.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'mock_api_key_for_testing' || apiKey.trim() === '') {
    console.warn('[AI Generator] No valid ANTHROPIC_API_KEY found. Falling back to mock test generation.');
    return getMockTestCases(prompt);
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      system: `You are an expert QA Automation Engineer. Generate a list of test cases in JSON format for the provided feature description.
Return ONLY valid JSON in this exact structure:
{
  "suiteName": "ConciseSuiteName",
  "testCases": [
    {
      "name": "Verify that user can add a high price item to cart",
      "description": "User adds high price item and verifies cart badge",
      "steps": [
        "Sort products by price high to low",
        "Add the first item to cart",
        "Go to cart page"
      ],
      "assertions": [
        "Cart badge shows 1",
        "Cart page lists the selected item"
      ]
    }
  ]
}`,
      messages: [{ role: 'user', content: `Generate 3 comprehensive test cases for this requirement: "${prompt}"` }],
    });

    const contentText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = contentText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`Failed to extract JSON from response: ${contentText}`);
    }

    const data = JSON.parse(jsonMatch[0]);
    return data;
  } catch (error: any) {
    console.error(`[AI Generator] Error calling Anthropic API: ${error.message}`);
    console.log('[AI Generator] Falling back to mock test generation.');
    return getMockTestCases(prompt);
  }
}

function getMockTestCases(prompt: string): { suiteName: string; testCases: TestCase[] } {
  return {
    suiteName: 'AI-Generated-Feature',
    testCases: [
      {
        name: `Verify basic flow for ${prompt}`,
        description: `Automated test verifying the happy path for: ${prompt}`,
        steps: [
          `Navigate to products screen`,
          `Simulate interaction with feature: ${prompt}`,
          `Proceed to checkout`
        ],
        assertions: [
          `Verify that the UI state matches expectation`,
          `Verify no error overlays are shown`
        ]
      },
      {
        name: `Verify boundary constraints for ${prompt}`,
        description: `Verify system limits, empty input, or cancel states for: ${prompt}`,
        steps: [
          `Open details pane`,
          `Attempt invalid action or cancel mid-flow`,
          `Reset flow`
        ],
        assertions: [
          `Verify warning label matches expected format`,
          `Verify cart or page count returns to previous state`
        ]
      }
    ]
  };
}
