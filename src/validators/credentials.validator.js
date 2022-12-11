import { z } from 'zod';

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(24),
});

export { CredentialsSchema };
