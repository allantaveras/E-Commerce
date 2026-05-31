import { Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly successHeader: Locator;
  readonly successText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successHeader = page.locator('.complete-header');
    this.successText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async getSuccessHeader(): Promise<string> {
    return (await this.successHeader.textContent()) || '';
  }

  async getSuccessText(): Promise<string> {
    return (await this.successText.textContent()) || '';
  }

  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
