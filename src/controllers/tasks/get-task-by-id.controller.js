import { GetTaskByIdService } from '../../services/tasks/get-task-by-id.service';

class GetTaskByIdController {
  /** @type {GetTaskByIdService} */
  #service;

  /**
   * @param {GetTaskByIdService} service
   */
  constructor(service) {
    if (!service || !(service instanceof GetTaskByIdService)) {
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
    const { id } = request.params;

    const task = await this.#service.handler(id);

    return response.json(task);
  }
}

export { GetTaskByIdController };
