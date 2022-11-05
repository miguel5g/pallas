import { Router } from 'express';

import { CreateAuthSessionController } from '../controllers/create-auth-session.controller';
import { DeleteAuthSessionController } from '../controllers/delete-auth-session.controller';
import { ProtectedRouteMiddleware } from '../middlewares/protected-route.middleware';
import { CreateAuthSessionService } from '../services/create-auth-session.service';

const authRoutes = Router();

const createAuthSessionController = new CreateAuthSessionController(new CreateAuthSessionService());
const deleteAuthSessionController = new DeleteAuthSessionController();
const protectedRouteMiddleware = new ProtectedRouteMiddleware();

authRoutes.post('/', createAuthSessionController.handler);
authRoutes.delete('/', protectedRouteMiddleware.handler, deleteAuthSessionController.handler);

export { authRoutes };
