import { Router } from 'express';

import { CreateUserController } from '../controllers/create-user.controller';
import { CreateUserService } from '../services/create-user.service';
import { GetAllUsersController } from '../controllers/get-all-users.controller';
import { GetAllUsersService } from '../services/get-all-users.service';
import { GetUserByIdController } from '../controllers/get-user-by-id.controller';
import { GetUserByIdService } from '../services/get-user-by-id.service';
import { ProtectedRouteMiddleware } from '../middlewares/protected-route.middleware';

const usersRoutes = Router();

const createUserController = new CreateUserController(new CreateUserService());
const getAllUsersController = new GetAllUsersController(new GetAllUsersService());
const getUserByIdController = new GetUserByIdController(new GetUserByIdService());
const protectedRouteMiddleware = new ProtectedRouteMiddleware();

usersRoutes.get('/', protectedRouteMiddleware.handler, getAllUsersController.handler);
usersRoutes.get('/:id', protectedRouteMiddleware.handler, getUserByIdController.handler);
usersRoutes.post('/', createUserController.handler);

export { usersRoutes };
