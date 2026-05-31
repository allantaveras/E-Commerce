import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export class CartPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  private getItemLocator(itemName: string): Locator {
    return this.cartItems.filter({ hasText: itemName });
  }

  async removeItem(itemName: string): Promise<void> {
    const item = this.getItemLocator(itemName);
    const removeBtn = item.locator('button:has-text("Remove")');
    await removeBtn.click();
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async getCartItemNames(): Promise<string[]> {
    const names = this.page.locator('.inventory_item_name');
    return names.allTextContents();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }
}
