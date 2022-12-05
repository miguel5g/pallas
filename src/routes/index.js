import { Router } from 'express';

import { authRoutes } from './auth.routes';
import { todoRoutes } from './todos.routes';
import { usersRoutes } from './users.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/todos', todoRoutes);
routes.use('/users', usersRoutes);

export { routes };
