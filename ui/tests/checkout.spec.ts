import { test, expect } from '../fixtures/base-test';
import { TestDataFactory } from '../../utils/test-data-factory';

test.describe('SauceDemo Checkout Suite @ui @checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('E2E happy path checkout of a single item', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    const item = 'Sauce Labs Backpack';
    await inventoryPage.addToCart(item);
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    const profile = TestDataFactory.createCustomerProfile();
    await checkoutInfoPage.fillInformation(profile.firstName, profile.lastName, profile.postalCode);
    await checkoutInfoPage.clickContinue();

    const items = await checkoutOverviewPage.getCartItemNames();
    expect(items).toContain(item);
    expect(await checkoutOverviewPage.getSubtotal()).toBe(29.99);

    await checkoutOverviewPage.clickFinish();
    expect(await checkoutCompletePage.getSuccessHeader()).toBe('Thank you for your order!');
  });

  test('E2E happy path checkout of multiple items', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    const itemsToAdd = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt', 'Sauce Labs Onesie'];
    for (const item of itemsToAdd) {
      await inventoryPage.addToCart(item);
    }
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    const profile = TestDataFactory.createCustomerProfile();
    await checkoutInfoPage.fillInformation(profile.firstName, profile.lastName, profile.postalCode);
    await checkoutInfoPage.clickContinue();

    const overviewItems = await checkoutOverviewPage.getCartItemNames();
    expect(overviewItems).toEqual(expect.arrayContaining(itemsToAdd));

    const subtotal = await checkoutOverviewPage.getSubtotal();
    expect(subtotal).toBe(29.99 + 15.99 + 7.99);

    await checkoutOverviewPage.clickFinish();
    expect(await checkoutCompletePage.getSuccessHeader()).toBe('Thank you for your order!');
  });

  test('Cancel checkout at Checkout Info step returns to Cart', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    page,
  }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    await checkoutInfoPage.clickCancel();
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('Cancel checkout at Checkout Overview step returns to Inventory', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    page,
  }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    const profile = TestDataFactory.createCustomerProfile();
    await checkoutInfoPage.fillInformation(profile.firstName, profile.lastName, profile.postalCode);
    await checkoutInfoPage.clickContinue();

    await checkoutOverviewPage.clickCancel();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Error message when First Name is missing', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    const profile = TestDataFactory.createInvalidCustomerProfile('firstName');
    await checkoutInfoPage.fillInformation(profile.firstName, profile.lastName, profile.postalCode);
    await checkoutInfoPage.clickContinue();

    const msg = await checkoutInfoPage.getErrorMessage();
    expect(msg).toContain('Error: First Name is required');
  });

  test('Error message when Last Name is missing', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    const profile = TestDataFactory.createInvalidCustomerProfile('lastName');
    await checkoutInfoPage.fillInformation(profile.firstName, profile.lastName, profile.postalCode);
    await checkoutInfoPage.clickContinue();

    const msg = await checkoutInfoPage.getErrorMessage();
    expect(msg).toContain('Error: Last Name is required');
  });

  test('Error message when Postal Code is missing', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    const profile = TestDataFactory.createInvalidCustomerProfile('postalCode');
    await checkoutInfoPage.fillInformation(profile.firstName, profile.lastName, profile.postalCode);
    await checkoutInfoPage.clickContinue();

    const msg = await checkoutInfoPage.getErrorMessage();
    expect(msg).toContain('Error: Postal Code is required');
  });

  test('Verify tax and total calculation correctness', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Fleece Jacket');
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    const profile = TestDataFactory.createCustomerProfile();
    await checkoutInfoPage.fillInformation(profile.firstName, profile.lastName, profile.postalCode);
    await checkoutInfoPage.clickContinue();

    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();
    const total = await checkoutOverviewPage.getTotal();

    // Verify subtotal matches Backpack (29.99) + Fleece Jacket (49.99) = 79.98
    expect(subtotal).toBe(79.98);

    // Verify final sum matches subtotal + tax
    expect(total).toBe(parseFloat((subtotal + tax).toFixed(2)));
  });

  test('Success text validation on order complete', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    const profile = TestDataFactory.createCustomerProfile();
    await checkoutInfoPage.fillInformation(profile.firstName, profile.lastName, profile.postalCode);
    await checkoutInfoPage.clickContinue();
    await checkoutOverviewPage.clickFinish();

    expect(await checkoutCompletePage.getSuccessText()).toContain(
      'Your order has been dispatched, and will arrive'
    );
  });

  test('Back Home button navigates back to store from order complete page', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    const profile = TestDataFactory.createCustomerProfile();
    await checkoutInfoPage.fillInformation(profile.firstName, profile.lastName, profile.postalCode);
    await checkoutInfoPage.clickContinue();
    await checkoutOverviewPage.clickFinish();

    await checkoutCompletePage.clickBackHome();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Allow checkout of empty cart (SauceDemo constraint)', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await inventoryPage.header.clickCart();
    await cartPage.clickCheckout();

    const profile = TestDataFactory.createCustomerProfile();
    await checkoutInfoPage.fillInformation(profile.firstName, profile.lastName, profile.postalCode);
    await checkoutInfoPage.clickContinue();

    expect(await checkoutOverviewPage.getSubtotal()).toBe(0.0);
    await checkoutOverviewPage.clickFinish();
    expect(await checkoutCompletePage.getSuccessHeader()).toBe('Thank you for your order!');
  });
});
