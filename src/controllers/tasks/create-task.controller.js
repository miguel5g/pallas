import { CreateTaskService } from '../../services/tasks/create-task.service';
import { CreateTaskSchema } from '../../validators';

class CreateTaskController {
  /** @type {CreateTaskService} */
  #service;

  /** @param {CreateTaskService} service */
  constructor(service) {
    if (!service || !(service instanceof CreateTaskService)) {
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

    const task = CreateTaskSchema.parse({ title });

    await this.#service.handler({ ...task, authorId: id });

    return response.status(201).json({ message: 'Task successfully created' });
  }
}

export { CreateTaskController };
