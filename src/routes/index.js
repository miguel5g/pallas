import { Router } from 'express';

import { authRoutes } from './auth.routes';
import { usersRoutes } from './users.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', usersRoutes);

export { routes };
