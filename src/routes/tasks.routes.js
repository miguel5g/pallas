import { Router } from 'express';

import { CreateTaskController } from '../controllers/tasks/create-task.controller';
import { DeleteTaskController } from '../controllers/tasks/delete-task.controller';
import { GetAllTasksController } from '../controllers/tasks/get-all-tasks.controller';
import { GetTaskByIdController } from '../controllers/tasks/get-task-by-id.controller';
import { UpdateTaskController } from '../controllers/tasks/update-task.controller';
import { ProtectedRouteMiddleware } from '../middlewares/protected-route.middleware';
import { CreateTaskService } from '../services/tasks/create-task.service';
import { DeleteTaskService } from '../services/tasks/delete-task.service';
import { GetAllTasksService } from '../services/tasks/get-all-tasks.service';
import { GetTaskByIdService } from '../services/tasks/get-task-by-id.service';
import { UpdateTaskService } from '../services/tasks/update-task.service';

const taskRoutes = Router();

const createTaskController = new CreateTaskController(new CreateTaskService());
const deleteTaskController = new DeleteTaskController(new DeleteTaskService());
const getAllTasksController = new GetAllTasksController(new GetAllTasksService());
const getTaskByIdController = new GetTaskByIdController(new GetTaskByIdService());
const updateTaskController = new UpdateTaskController(new UpdateTaskService());
const protectedRouteMiddleware = new ProtectedRouteMiddleware();

taskRoutes.post('/', protectedRouteMiddleware.handler, createTaskController.handler);
taskRoutes.get('/', protectedRouteMiddleware.handler, getAllTasksController.handler);
taskRoutes.get('/:id', protectedRouteMiddleware.handler, getTaskByIdController.handler);
taskRoutes.patch('/:id', protectedRouteMiddleware.handler, updateTaskController.handler);
taskRoutes.delete('/:id', protectedRouteMiddleware.handler, deleteTaskController.handler);

export { taskRoutes };
