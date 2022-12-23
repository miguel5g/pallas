import { GetAllTasksService } from '../../services/tasks/get-all-tasks.service';

class GetAllTasksController {
  /** @type {GetAllTasksService} */
  #service;

  /**
   * @param {GetAllTasksService} service
   */
  constructor(service) {
    if (!service || !(service instanceof GetAllTasksService)) {
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

    const tasks = await this.#service.handler(id);

    return response.json({ tasks });
  }
}

export { GetAllTasksController };
