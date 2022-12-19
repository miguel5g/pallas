import { BadRequestError, UnprocessableError } from '../../errors';
import { UpdateTaskService } from '../../services/tasks/update-task.service';
import { UpdateTaskSchema } from '../../validators/update-task.validator';

class UpdateTaskController {
  /** @type {UpdateTaskService} */
  #service;

  /**
   * @param {UpdateTaskService} service
   */
  constructor(service) {
    if (!service || !(service instanceof UpdateTaskService)) {
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
    const { title, status } = request.body;

    if (status && !['TODO', 'DOING', 'DONE'].includes(status)) {
      throw new UnprocessableError('Invalid task status');
    }

    const task = UpdateTaskSchema.parse({ title, status });

    if (Object.values(task).filter((field) => field !== undefined).length <= 0) {
      throw new BadRequestError('Invalid request body');
    }

    await this.#service.handler({ id, ...task });

    return response.json({ message: 'Task successfully updated' });
  }
}

export { UpdateTaskController };
