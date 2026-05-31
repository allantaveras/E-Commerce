export const LOCATOR_REGISTRY: Record<string, string[]> = {
  'login.username': [
    '[data-test="username"]',
    'input[placeholder="Username"]',
    '#user-name',
    'input[type="text"]'
  ],
  'login.password': [
    '[data-test="password"]',
    'input[placeholder="Password"]',
    '#password',
    'input[type="password"]'
  ],
  'login.button': [
    '[data-test="login-button"]',
    'input[type="submit"]',
    '#login-button',
    'input.submit-button'
  ],
  // We intentionally break the primary locator to trigger and demonstrate self-healing!
  'checkout.button': [
    '[data-test="checkout-broken-non-existent"]', 
    '[data-test="checkout"]', 
    'button:has-text("Checkout")',
    '#checkout'
  ]
};
