import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(3).max(16),
  surname: z.string().min(3).max(16),
  password: z.string().min(6).max(24),
  email: z.string().email(),
});

export { CreateUserSchema };
