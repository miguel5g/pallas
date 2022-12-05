import { Router } from 'express';

import { GetAllTodosController } from '../controllers/todos/get-all-todos.controller';
import { ProtectedRouteMiddleware } from '../middlewares/protected-route.middleware';
import { GetAllTodosService } from '../services/todos/get-all-todos.service';

const todoRoutes = Router();

const getAllTodosController = new GetAllTodosController(new GetAllTodosService());
const protectedRouteMiddleware = new ProtectedRouteMiddleware();

todoRoutes.get('/', protectedRouteMiddleware.handler, getAllTodosController.handler);

export { todoRoutes };
