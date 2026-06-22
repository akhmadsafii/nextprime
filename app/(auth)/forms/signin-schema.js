import { z } from 'zod';

export function getSigninSchema() {
  return z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(1, 'Password is required.'),
    rememberMe: z.boolean().optional(),
  });
}
