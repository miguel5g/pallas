import { DeleteTaskService } from '../../services/tasks/delete-task.service';

class DeleteTaskController {
  /** @type {DeleteTaskService} */
  #service;

  /**
   * @param {DeleteTaskService} service
   */
  constructor(service) {
    if (!service || !(service instanceof DeleteTaskService)) {
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

    await this.#service.handler(id, userId);

    return response.json({ message: 'Task successfully deleted' });
  }
}

export { DeleteTaskController };
