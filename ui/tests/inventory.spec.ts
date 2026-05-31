import { test, expect } from '../fixtures/base-test';

test.describe('SauceDemo Inventory & Product Details Suite @ui @inventory', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Verify default sorting is alphabetical (A to Z)', async ({ inventoryPage }) => {
    const names = await inventoryPage.getProductNames();
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  test('Sort products Name (Z to A)', async ({ inventoryPage }) => {
    await inventoryPage.sortProducts('za');
    const names = await inventoryPage.getProductNames();
    const sortedNames = [...names].sort().reverse();
    expect(names).toEqual(sortedNames);
  });

  test('Sort products Price (low to high)', async ({ inventoryPage }) => {
    await inventoryPage.sortProducts('lohi');
    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('Sort products Price (high to low)', async ({ inventoryPage }) => {
    await inventoryPage.sortProducts('hilo');
    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('Add single item to cart updates badge count', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    const count = await inventoryPage.header.getCartCount();
    expect(count).toBe(1);
  });

  test('Add multiple items to cart updates badge count', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');
    const count = await inventoryPage.header.getCartCount();
    expect(count).toBe(2);
  });

  test('Remove item from inventory page updates badge count', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.removeFromCart('Sauce Labs Backpack');
    const count = await inventoryPage.header.getCartCount();
    expect(count).toBe(0);
  });

  test('Add and remove toggles button text', async ({ inventoryPage }) => {
    const item = 'Sauce Labs Backpack';
    await expect(await inventoryPage.isAddToCartButtonVisible(item)).toBeTruthy();
    await inventoryPage.addToCart(item);
    await expect(await inventoryPage.isRemoveButtonVisible(item)).toBeTruthy();
    await inventoryPage.removeFromCart(item);
    await expect(await inventoryPage.isAddToCartButtonVisible(item)).toBeTruthy();
  });

  test('Clicking product name navigates to details page', async ({ inventoryPage, page }) => {
    const item = 'Sauce Labs Backpack';
    await inventoryPage.clickProduct(item);
    await expect(page).toHaveURL(/.*inventory-item.html\?id=\d+/);
  });

  test('Product details page shows correct information', async ({ inventoryPage, productDetailPage }) => {
    const item = 'Sauce Labs Backpack';
    await inventoryPage.clickProduct(item);
    expect(await productDetailPage.getProductName()).toBe(item);
    expect(await productDetailPage.getProductPrice()).toBe(29.99);
    expect(await productDetailPage.getProductDescription()).toContain('sleek, streamlined Sly Pack');
  });

  test('Add to cart from product details page updates badge', async ({ inventoryPage, productDetailPage }) => {
    const item = 'Sauce Labs Backpack';
    await inventoryPage.clickProduct(item);
    await productDetailPage.addToCart();
    expect(await productDetailPage.header.getCartCount()).toBe(1);
    await expect(await productDetailPage.isRemoveButtonVisible()).toBeTruthy();
  });

  test('Remove from cart from product details page updates badge', async ({ inventoryPage, productDetailPage }) => {
    const item = 'Sauce Labs Backpack';
    await inventoryPage.clickProduct(item);
    await productDetailPage.addToCart();
    await productDetailPage.removeFromCart();
    expect(await productDetailPage.header.getCartCount()).toBe(0);
    await expect(await productDetailPage.isAddToCartButtonVisible()).toBeTruthy();
  });

  test('Back to products button returns to inventory', async ({ inventoryPage, productDetailPage, page }) => {
    await inventoryPage.clickProduct('Sauce Labs Backpack');
    await productDetailPage.clickBackToProducts();
    await expect(page).toHaveURL(/.*inventory.html/);
  });
});
