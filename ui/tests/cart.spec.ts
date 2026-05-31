import { test, expect } from '../fixtures/base-test';

test.describe('SauceDemo Cart Suite @ui @cart', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Cart is initially empty', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.header.clickCart();
    expect(await cartPage.getCartItemCount()).toBe(0);
    const names = await cartPage.getCartItemNames();
    expect(names.length).toBe(0);
  });

  test('Cart lists items added from Inventory Page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');
    await inventoryPage.header.clickCart();

    const items = await cartPage.getCartItemNames();
    expect(items).toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Bolt T-Shirt');
    expect(await cartPage.getCartItemCount()).toBe(2);
  });

  test('Remove item from Cart Page updates the item list', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');
    await inventoryPage.header.clickCart();

    await cartPage.removeItem('Sauce Labs Backpack');
    const items = await cartPage.getCartItemNames();
    expect(items).not.toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Bolt T-Shirt');
  });

  test('Remove item from Cart Page updates header cart badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.clickCart();
    expect(await cartPage.header.getCartCount()).toBe(1);

    await cartPage.removeItem('Sauce Labs Backpack');
    expect(await cartPage.header.getCartCount()).toBe(0);
  });

  test('Clicking Continue Shopping goes back to inventory page', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.header.clickCart();
    await cartPage.clickContinueShopping();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Navigation to Cart Page works via header icon', async ({ inventoryPage, page }) => {
    await inventoryPage.header.clickCart();
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('Verify cart state persists after page refresh', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.clickCart();
    await page.reload();
    const items = await cartPage.getCartItemNames();
    expect(items).toContain('Sauce Labs Backpack');
    expect(await cartPage.header.getCartCount()).toBe(1);
  });

  test('Resetting app state clears the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    expect(await inventoryPage.header.getCartCount()).toBe(1);
    await inventoryPage.header.resetAppState();
    expect(await inventoryPage.header.getCartCount()).toBe(0);
    
    await inventoryPage.header.clickCart();
    expect(await cartPage.getCartItemCount()).toBe(0);
  });
});
