import { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutButton: Locator;
  readonly aboutButton: Locator;
  readonly resetStateButton: Locator;
  readonly allItemsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.allItemsButton = page.locator('#inventory_sidebar_link');
    this.aboutButton = page.locator('#about_sidebar_link');
    this.logoutButton = page.locator('#logout_sidebar_link');
    this.resetStateButton = page.locator('#reset_sidebar_link');
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.textContent();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  async clickCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await this.logoutButton.waitFor({ state: 'visible' });
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutButton.click();
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetStateButton.click();
    // Close menu or wait
    await this.page.locator('#react-burger-cross-btn').click();
    await this.menuButton.waitFor({ state: 'visible' });
  }
}
