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
    const { id: userId } = request.user;

    const task = await this.#service.handler(id, userId);

    return response.json(task);
  }
}

export { GetTaskByIdController };
