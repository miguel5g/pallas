import { GetAllTodosService } from '../../services/todos/get-all-todos.service';

class GetAllTodosController {
  /** @type {GetAllTodosService} */
  #service;

  /**
   * @param {GetAllTodosService} service
   */
  constructor(service) {
    if (!service) {
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

    const todos = await this.#service.handler(id);

    return response.json({
      todos,
    });
  }
}

export { GetAllTodosController };
