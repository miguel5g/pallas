import { Router } from 'express';

import { GetAllUsersController } from '../controllers/get-all-users.controller';

const usersRoutes = Router();
const getAllUsersController = new GetAllUsersController();

usersRoutes.get('/', getAllUsersController.handler);

export { usersRoutes };
