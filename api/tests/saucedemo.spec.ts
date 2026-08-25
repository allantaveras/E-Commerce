import { test, expect } from '@playwright/test';
import { SaucedemoClient } from '../clients/saucedemo-client';
import {
  ProductSchema,
  CartItemSchema,
  LoginSuccessSchema,
  ErrorResponseSchema,
} from '../schemas/saucedemo-schema';
import { z } from 'zod';

test.describe('SauceDemo API Automation Suite @api', () => {
  let client: SaucedemoClient;

  test.beforeEach(({ request }) => {
    client = new SaucedemoClient(request);
  });

  test('POST /api/login - login success (mocked)', async () => {
    const response = await client.login('standard_user', 'secret_sauce');
    expect(response.status()).toBe(200);

    const json = await response.json();
    const result = LoginSuccessSchema.safeParse(json);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.token).toBeDefined();
      expect(result.data.username).toBe('standard_user');
    }
  });

  test('POST /api/login - login fail due to missing credentials (mocked)', async () => {
    const response = await client.login('');
    expect(response.status()).toBe(400);

    const json = await response.json();
    const result = ErrorResponseSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.error).toBe('Username and password are required');
    }
  });

  test('POST /api/login - login fail for locked out user (mocked)', async () => {
    const response = await client.login('locked_out_user', 'secret_sauce');
    expect(response.status()).toBe(401);

    const json = await response.json();
    const result = ErrorResponseSchema.safeParse(json);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.error).toBe('Sorry, this user has been locked out.');
    }
  });

  test('GET /api/products - retrieve product list and validate schemas (mocked)', async () => {
    const response = await client.getProducts();
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(Array.isArray(json)).toBe(true);

    // Validate using Zod array schema
    const ProductListSchema = z.array(ProductSchema);
    const result = ProductListSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].name).toBe('Sauce Labs Backpack');
    }
  });

  test('GET /api/products/:id - retrieve single product (mocked)', async () => {
    const response = await client.getProduct(1);
    expect(response.status()).toBe(200);

    const json = await response.json();
    const result = ProductSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.id).toBe(1);
      expect(result.data.name).toBe('Sauce Labs Backpack');
    }
  });

  test('GET /api/products/:id - return 404 for non-existent product (mocked)', async () => {
    const response = await client.getProduct(999);
    expect(response.status()).toBe(404);
    
    const json = await response.json();
    const result = ErrorResponseSchema.safeParse(json);
    expect(result.success).toBe(true);
  });

  test('POST /api/cart - add item to cart (mocked)', async () => {
    const response = await client.addToCart(1, 2);
    expect(response.status()).toBe(201);

    const json = await response.json();
    const result = CartItemSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.id).toBe(1);
      expect(result.data.quantity).toBe(2);
    }
  });
});
