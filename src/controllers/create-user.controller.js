import { CreateUserService } from '../services/create-user.service';

class CreateUserController {
  /** @type {CreateUserService} */
  #service;

  constructor(service) {
    this.#service = service;
    this.handler = this.handler.bind(this);
  }

  /**
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @returns {Promise<void>}
   */
  async handler(request, response) {
    const { name, surname, email, password } = request.body;

    /** @todo: improve body validation with zod */

    if ([name, surname, email, password].some((value) => !value)) {
      return response.status(400).json({ message: 'Invalid user body' });
    }

    /** @todo: improve error handler with try/catch */

    await this.#service.handler({ name, surname, email, password });

    return response.status(201).json({ message: 'User created successfully' });
  }
}

export { CreateUserController };
