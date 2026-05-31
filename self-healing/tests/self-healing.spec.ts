import { test, expect } from '../fixtures/self-healing-fixture';

test.describe('Self-Healing Locator Demo Suite @self-healing', () => {
  test('Should recover from a broken selector using fallback registry', async ({ page, healingPage }) => {
    // 1. Navigate to store
    await page.goto('https://www.saucedemo.com');

    // 2. Perform login using self-healing registry locators
    const usernameInput = await healingPage.getLocator('login.username');
    const passwordInput = await healingPage.getLocator('login.password');
    const loginButton = await healingPage.getLocator('login.button');

    await usernameInput.fill('standard_user');
    await passwordInput.fill('secret_sauce');
    await loginButton.click();

    await expect(page).toHaveURL(/.*inventory.html/);

    // 3. Add an item and navigate to cart
    await page.locator('button:has-text("Add to cart")').first().click();
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart.html/);

    // 4. Click checkout button (which is intentionally mapped to a broken primary selector!)
    console.log('[Test] Triggering click on checkout button. Watch self-healing log warnings below:');
    const checkoutBtn = await healingPage.getLocator('checkout.button');
    await checkoutBtn.click();

    // 5. Assert that checkout info screen is reached (proving locator healed successfully!)
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    console.log('[Test] Successfully arrived at Checkout Info screen after locator recovery!');
  });
});
