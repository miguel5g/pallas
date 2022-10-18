import { GetAllUsersService } from '../services/get-all-users.service';

class GetAllUsersController {
  /** @type {GetAllUsersService} */
  #service;

  /**
   * @param {GetAllUsersService} service
   */
  constructor(service) {
    this.#service = service;
  }

  /**
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @returns {Promise<void>}
   */
  async handler(request, response) {
    return response.json({ message: 'Under construction' });
  }
}

export { GetAllUsersController };
