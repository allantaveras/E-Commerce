import { test, expect } from '@playwright/test';
import { PlaceholderClient } from '../clients/placeholder-client';
import {
  UserSchema,
  PostSchema,
  LoginSuccessSchema,
  RegisterSuccessSchema,
  ErrorResponseSchema,
} from '../schemas/user-schema';
import { z } from 'zod';

test.describe('JSONPlaceholder API Automation Suite @api', () => {
  let client: PlaceholderClient;

  test.beforeEach(({ request }) => {
    client = new PlaceholderClient(request);
  });

  test('GET /users - retrieve user list and validate nested schemas', async () => {
    const response = await client.getUsers();
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const json = await response.json();
    expect(Array.isArray(json)).toBe(true);

    // Validate using Zod array schema
    const UserListSchema = z.array(UserSchema);
    const result = UserListSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].name).toBeDefined();
      expect(result.data[0].address.city).toBeDefined();
    }
  });

  test('GET /users/:id - retrieve single user and validate nested fields', async () => {
    const response = await client.getUser(1);
    expect(response.status()).toBe(200);

    const json = await response.json();
    const result = UserSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.id).toBe(1);
      expect(result.data.name).toBe('Leanne Graham');
      expect(result.data.company.name).toBe('Romaguera-Crona');
    }
  });

  test('GET /users/:id - return 404 for non-existent user', async () => {
    const response = await client.getUser(9999);
    expect(response.status()).toBe(404);
  });

  test('POST /posts - create a new post', async () => {
    const title = 'Playwright Testing';
    const body = 'Writing an automation framework from scratch';
    const userId = 1;

    const response = await client.createPost(title, body, userId);
    expect(response.status()).toBe(201);

    const json = await response.json();
    const result = PostSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.title).toBe(title);
      expect(result.data.body).toBe(body);
      expect(result.data.id).toBeDefined();
    }
  });

  test('PUT /posts/:id - update post details', async () => {
    const title = 'Updated Title';
    const body = 'Updated body contents';
    const userId = 1;

    const response = await client.updatePost(1, title, body, userId, false);
    expect(response.status()).toBe(200);

    const json = await response.json();
    const result = PostSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.title).toBe(title);
      expect(result.data.body).toBe(body);
    }
  });

  test('PATCH /posts/:id - patch post details', async () => {
    const title = 'Patched Title';
    const body = 'Patched body';
    const userId = 1;

    const response = await client.updatePost(1, title, body, userId, true);
    expect(response.status()).toBe(200);

    const json = await response.json();
    const result = PostSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.title).toBe(title);
      expect(result.data.body).toBe(body);
    }
  });

  test('DELETE /posts/:id - delete a post', async () => {
    const response = await client.deletePost(1);
    expect(response.status()).toBe(200); // JSONPlaceholder returns 200 for deletion
  });

  test('POST /api/register - registration success (mocked)', async () => {
    const response = await client.register('eve.holt@reqres.in', 'pistol');
    expect(response.status()).toBe(200);

    const json = await response.json();
    const result = RegisterSuccessSchema.safeParse(json);
    expect(result.success).toBe(true);
  });

  test('POST /api/register - registration fail due to missing password (mocked)', async () => {
    const response = await client.register('sydney@fife');
    expect(response.status()).toBe(400);

    const json = await response.json();
    const result = ErrorResponseSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.error).toBe('Missing password');
    }
  });

  test('POST /api/login - login success (mocked)', async () => {
    const response = await client.login('eve.holt@reqres.in', 'cityslicka');
    expect(response.status()).toBe(200);

    const json = await response.json();
    const result = LoginSuccessSchema.safeParse(json);
    expect(result.success).toBe(true);
  });

  test('POST /api/login - login fail due to missing password (mocked)', async () => {
    const response = await client.login('peter@klaven');
    expect(response.status()).toBe(400);

    const json = await response.json();
    const result = ErrorResponseSchema.safeParse(json);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.error).toBe('Missing password');
    }
  });
});
