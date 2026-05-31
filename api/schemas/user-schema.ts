import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: z.object({
      lat: z.string(),
      lng: z.string(),
    }),
  }),
  phone: z.string(),
  website: z.string(),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
  }),
});

export const PostSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

export const LoginSuccessSchema = z.object({
  token: z.string(),
});

export const RegisterSuccessSchema = z.object({
  id: z.number(),
  token: z.string(),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});
