import * as dotenv from 'dotenv';
import * as path from 'path';

// Ensure env variables are loaded if imported outside Playwright context (e.g. via CLI scripts)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com',
  API_BASE_URL: process.env.API_BASE_URL || 'https://reqres.in',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
};
