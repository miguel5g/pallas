import { Router } from 'express';

import { GetAllUsersController } from '../controllers/get-all-users.controller';
import { GetAllUsersService } from '../services/get-all-users.service';

const usersRoutes = Router();
const getAllUsersController = new GetAllUsersController(new GetAllUsersService());

usersRoutes.get('/', getAllUsersController.handler);

export { usersRoutes };
