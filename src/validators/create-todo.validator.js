import { z } from 'zod';

const CreateTodoSchema = z.object({
  title: z.string().min(3).max(128),
});

export { CreateTodoSchema };
