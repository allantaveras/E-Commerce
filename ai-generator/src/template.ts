export interface TestCase {
  name: string;
  description: string;
  steps: string[];
  assertions: string[];
}

/**
 * Compiles a structured array of JSON test cases into a fully formatted Playwright test spec file.
 */
export function generatePlaywrightSpec(suiteName: string, testCases: TestCase[]): string {
  const casesStr = testCases.map(tc => {
    const formattedSteps = tc.steps.map(step => `    // TODO: Implement Step - ${step}`).join('\n');
    const formattedAssertions = tc.assertions.map(assertion => `    // TODO: Validate Assertion - ${assertion}`).join('\n');
    const safeName = tc.name.replace(/'/g, "\\'");
    
    return `  test('${safeName}', async ({ loginPage, inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage, page }) => {
    // Description: ${tc.description}
    
    // Precondition: User is logged in
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
    
${formattedSteps}

${formattedAssertions}
  });`;
  }).join('\n\n');

  return `import { test, expect } from '../../fixtures/base-test';

test.describe('AI Generated Suite - ${suiteName} @ui @generated', () => {
${casesStr}
});
`;
}
