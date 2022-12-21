import { z } from 'zod';

const UpdateTaskSchema = z.object({
  title: z.string().min(3).max(128).optional(),
  status: z.string().optional(),
});

export { UpdateTaskSchema };
