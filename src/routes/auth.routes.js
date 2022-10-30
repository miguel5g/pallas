import { Router } from 'express';
import { CreateAuthSessionController } from '../controllers/create-auth-session.controller';

import { ProtectedRouteMiddleware } from '../middlewares/protected-route.middleware';
import { CreateAuthSession } from '../services/create-auth-session.service';

const authRoutes = Router();

const createAuthSessionController = new CreateAuthSessionController(new CreateAuthSession());
const protectedRouteMiddleware = new ProtectedRouteMiddleware();

authRoutes.post('/', createAuthSessionController.handler);
authRoutes.delete('/', protectedRouteMiddleware.handler);

export { authRoutes };
