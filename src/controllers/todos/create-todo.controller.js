import { CreateTodoService } from '../../services/todos/create-todo.service';
import { CreateTodoSchema } from '../../validators';

class CreateTodoController {
  /** @type {CreateTodoService} */
  #service;

  /** @param {CreateTodoService} service */
  constructor(service) {
    if (!service || !(service instanceof CreateTodoService)) {
      throw new Error('Invalid service instance');
    }

    this.#service = service;
    this.handler = this.handler.bind(this);
  }

  /**
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @returns {Promise<void>}
   */
  async handler(request, response) {
    const { id } = request.user;
    const { title } = request.body;

    const todo = CreateTodoSchema.parse({ title });

    await this.#service.handler({ ...todo, authorId: id });

    return response.status(201).json({ message: 'Todo successfully created' });
  }
}

export { CreateTodoController };
