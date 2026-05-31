import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export class ProductDetailPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.addToCartButton = page.locator('button:has-text("Add to cart")');
    this.removeButton = page.locator('button:has-text("Remove")');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) || '';
  }

  async getProductDescription(): Promise<string> {
    return (await this.productDescription.textContent()) || '';
  }

  async getProductPrice(): Promise<number> {
    const text = await this.productPrice.textContent();
    return text ? parseFloat(text.replace('$', '')) : 0;
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  async isAddToCartButtonVisible(): Promise<boolean> {
    return this.addToCartButton.isVisible();
  }

  async isRemoveButtonVisible(): Promise<boolean> {
    return this.removeButton.isVisible();
  }

  async clickBackToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
