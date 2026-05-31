import { test, expect } from '../fixtures/base-test';

test.describe('SauceDemo Login Suite @ui @login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('Successful login with standard user', async ({ loginPage, page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Error message shown for locked_out_user', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    const msg = await loginPage.getErrorMessage();
    expect(msg).toContain('Epic sadface: Sorry, this user has been locked out.');
  });

  test('Successful login with problem_user', async ({ loginPage, page }) => {
    await loginPage.login('problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Successful login with performance_glitch_user', async ({ loginPage, page }) => {
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Successful login with error_user', async ({ loginPage, page }) => {
    await loginPage.login('error_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Successful login with visual_user', async ({ loginPage, page }) => {
    await loginPage.login('visual_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Login failure with invalid password', async ({ loginPage }) => {
    await loginPage.login('standard_user', 'wrong_sauce');
    const msg = await loginPage.getErrorMessage();
    expect(msg).toContain('Username and password do not match any user in this service');
  });

  test('Login failure with empty username', async ({ loginPage }) => {
    await loginPage.login('', 'secret_sauce');
    const msg = await loginPage.getErrorMessage();
    expect(msg).toContain('Username is required');
  });

  test('Login failure with empty password', async ({ loginPage }) => {
    await loginPage.login('standard_user', '');
    const msg = await loginPage.getErrorMessage();
    expect(msg).toContain('Password is required');
  });
});
