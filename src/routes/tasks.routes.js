import { Router } from 'express';

import { CreateTaskController } from '../controllers/tasks/create-task.controller';
import { GetAllTasksController } from '../controllers/tasks/get-all-tasks.controller';
import { ProtectedRouteMiddleware } from '../middlewares/protected-route.middleware';
import { CreateTaskService } from '../services/tasks/create-task.service';
import { GetAllTasksService } from '../services/tasks/get-all-tasks.service';

const taskRoutes = Router();

const getAllTasksController = new GetAllTasksController(new GetAllTasksService());
const createTaskController = new CreateTaskController(new CreateTaskService());
const protectedRouteMiddleware = new ProtectedRouteMiddleware();

taskRoutes.post('/', protectedRouteMiddleware.handler, createTaskController.handler);
taskRoutes.get('/', protectedRouteMiddleware.handler, getAllTasksController.handler);

export { taskRoutes };
