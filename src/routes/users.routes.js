import { Router } from 'express';

import { CreateUserController } from '../controllers/create-user.controller';
import { CreateUserService } from '../services/create-user.service';
import { GetAllUsersController } from '../controllers/get-all-users.controller';
import { GetAllUsersService } from '../services/get-all-users.service';

const usersRoutes = Router();

const createUserController = new CreateUserController(new CreateUserService());
const getAllUsersController = new GetAllUsersController(new GetAllUsersService());

usersRoutes.post('/', createUserController.handler)
usersRoutes.get('/', getAllUsersController.handler);

export { usersRoutes };
