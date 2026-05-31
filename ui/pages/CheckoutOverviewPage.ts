import { Locator, Page } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getCartItemNames(): Promise<string[]> {
    const names = this.page.locator('.inventory_item_name');
    return names.allTextContents();
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.textContent();
    return text ? parseFloat(text.replace('Item total: $', '')) : 0;
  }

  async getTax(): Promise<number> {
    const text = await this.taxLabel.textContent();
    return text ? parseFloat(text.replace('Tax: $', '')) : 0;
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent();
    return text ? parseFloat(text.replace('Total: $', '')) : 0;
  }
}
