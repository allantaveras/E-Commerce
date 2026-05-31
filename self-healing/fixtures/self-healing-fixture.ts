import { test as baseTest, Page, Locator } from '@playwright/test';
import { LOCATOR_REGISTRY } from '../locators/registry';
import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../../utils/env';

export class HealingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getLocator(key: string): Promise<Locator> {
    const selectors = LOCATOR_REGISTRY[key];
    if (!selectors || selectors.length === 0) {
      throw new Error(`[Self-Healing] No selectors defined in registry for key: "${key}"`);
    }

    // Iterate through list of selectors in registry
    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];
      try {
        const locator = this.page.locator(selector);
        // Quick attach check (2 seconds timeout per selector)
        await locator.waitFor({ state: 'attached', timeout: 2000 });

        // Log warning if we recovered using a fallback
        if (i > 0) {
          console.warn(`⚠️ [Self-Healing] Primary locator '${selectors[0]}' for key '${key}' failed. Healed using fallback selector: '${selector}'`);
        }
        return this.page.locator(selector);
      } catch (e) {
        console.log(`[Self-Healing] Selector '${selector}' for key '${key}' not found/attached. Trying next fallback...`);
      }
    }

    console.error(`❌ [Self-Healing] All fallback locators for key '${key}' failed! Trying AI suggestion...`);
    const aiSelector = await this.trySuggestLocatorWithAI(key);
    if (aiSelector) {
      try {
        const locator = this.page.locator(aiSelector);
        await locator.waitFor({ state: 'attached', timeout: 2000 });
        console.warn(`🤖 [Self-Healing] AI successfully suggested a working locator: '${aiSelector}'`);
        return locator;
      } catch (e) {
        console.error(`🤖 [Self-Healing] AI suggestion '${aiSelector}' failed to resolve.`);
      }
    }

    // Default to primary locator if everything fails, letting standard assertions show failures
    return this.page.locator(selectors[0]);
  }

  private async trySuggestLocatorWithAI(key: string): Promise<string | null> {
    const apiKey = ENV.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'mock_api_key_for_testing' || apiKey.trim() === '') {
      console.warn('[Self-Healing] No valid ANTHROPIC_API_KEY found. Skipping AI locator suggest.');
      return null;
    }

    try {
      const bodyHtml = await this.page.evaluate(() => {
        // Grab simplified structure to reduce token usage
        return document.body.innerHTML.substring(0, 15000);
      });

      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        system: 'You are an automated self-healing locator tool. Inspect the HTML structure and suggest a single, simple, valid CSS selector that locates the desired element for the provided context key. Output ONLY the raw CSS selector string (e.g. #submit-btn or button:has-text("Checkout")) with no markdown, quotes, or conversational explanations.',
        messages: [{ role: 'user', content: `Context element key to find: "${key}"\n\nPage HTML fragment:\n${bodyHtml}` }]
      });

      const selectorText = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
      return selectorText || null;
    } catch (err: any) {
      console.error(`[Self-Healing] AI healing lookup failed: ${err.message}`);
      return null;
    }
  }
}

export const test = baseTest.extend<{ healingPage: HealingPage }>({
  healingPage: async ({ page }, use) => {
    await use(new HealingPage(page));
  }
});

export { expect } from '@playwright/test';
