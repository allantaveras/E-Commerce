import * as fs from 'fs';
import * as path from 'path';
import { generateTestCases } from './src/generator';
import { generatePlaywrightSpec } from './src/template';

async function main() {
  const args = process.argv.slice(2);
  let prompt = '';
  let outputPath = 'ui/tests/generated/ai-test.spec.ts';

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--prompt' || args[i] === '-p') && args[i + 1]) {
      prompt = args[i + 1];
      i++;
    } else if ((args[i] === '--output' || args[i] === '-o') && args[i + 1]) {
      outputPath = args[i + 1];
      i++;
    }
  }

  if (!prompt) {
    console.error('Error: Please provide a feature description prompt using --prompt "your feature description"');
    console.log('Usage: npm run generate-tests -- --prompt "Add items to cart" --output "ui/tests/generated/cart-tests.spec.ts"');
    process.exit(1);
  }

  console.log(`[AI Generator] Processing requirement: "${prompt}"...`);
  const result = await generateTestCases(prompt);

  console.log(`[AI Generator] Compiling Playwright test spec for suite "${result.suiteName}"...`);
  const specCode = generatePlaywrightSpec(result.suiteName, result.testCases);

  const fullOutputPath = path.resolve(process.cwd(), outputPath);
  const dir = path.dirname(fullOutputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullOutputPath, specCode, 'utf8');
  console.log(`[AI Generator] Successfully generated Playwright test spec!`);
  console.log(`[AI Generator] File written to: ${fullOutputPath}`);
}

main().catch(err => {
  console.error('[AI Generator] Critical error during execution:', err);
  process.exit(1);
});
