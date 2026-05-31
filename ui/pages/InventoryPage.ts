import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export class InventoryPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly activeSortOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.activeSortOption = page.locator('.active_option');
  }

  private getItemLocator(itemName: string): Locator {
    return this.inventoryItems.filter({ hasText: itemName });
  }

  async addToCart(itemName: string): Promise<void> {
    const item = this.getItemLocator(itemName);
    const addBtn = item.locator('button:has-text("Add to cart")');
    await addBtn.click();
  }

  async removeFromCart(itemName: string): Promise<void> {
    const item = this.getItemLocator(itemName);
    const removeBtn = item.locator('button:has-text("Remove")');
    await removeBtn.click();
  }

  async isAddToCartButtonVisible(itemName: string): Promise<boolean> {
    const item = this.getItemLocator(itemName);
    return item.locator('button:has-text("Add to cart")').isVisible();
  }

  async isRemoveButtonVisible(itemName: string): Promise<boolean> {
    const item = this.getItemLocator(itemName);
    return item.locator('button:has-text("Remove")').isVisible();
  }

  async sortProducts(optionValue: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getActiveSortText(): Promise<string> {
    return (await this.activeSortOption.textContent()) || '';
  }

  async getProductNames(): Promise<string[]> {
    const names = this.page.locator('.inventory_item_name');
    return names.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const pricesText = await this.page.locator('.inventory_item_price').allTextContents();
    return pricesText.map(price => parseFloat(price.replace('$', '')));
  }

  async clickProduct(itemName: string): Promise<void> {
    const nameLink = this.page.locator('.inventory_item_name', { hasText: itemName });
    await nameLink.click();
  }
}
