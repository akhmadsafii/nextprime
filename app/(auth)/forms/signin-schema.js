import { z } from 'zod';

export function getSigninSchema() {
  return z.object({
    userid: z.string().trim().min(1, 'NIK / User ID wajib diisi.'),
    password: z.string().min(1, 'Password wajib diisi.'),
    rememberMe: z.boolean().optional(),
  });
}
