import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(3).max(128),
});

export { CreateTaskSchema };
