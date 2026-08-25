import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string(),
});

export const CartItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginSuccessSchema = z.object({
  token: z.string(),
  username: z.string(),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});
