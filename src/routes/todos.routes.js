import { Router } from 'express';

import { CreateTodoController } from '../controllers/todos/create-todo.controller';
import { GetAllTodosController } from '../controllers/todos/get-all-todos.controller';
import { ProtectedRouteMiddleware } from '../middlewares/protected-route.middleware';
import { CreateTodoService } from '../services/todos/create-todo.service';
import { GetAllTodosService } from '../services/todos/get-all-todos.service';

const todoRoutes = Router();

const getAllTodosController = new GetAllTodosController(new GetAllTodosService());
const createTodoController = new CreateTodoController(new CreateTodoService());
const protectedRouteMiddleware = new ProtectedRouteMiddleware();

todoRoutes.post('/', protectedRouteMiddleware.handler, createTodoController.handler);
todoRoutes.get('/', protectedRouteMiddleware.handler, getAllTodosController.handler);

export { todoRoutes };
