import { GetUserByIdService } from '../services/get-user-by-id.service';

class GetUserByIdController {
  #service;

  /**
   * @param {GetUserByIdService} service
   */
  constructor(service) {
    if (!service || !(service instanceof GetUserByIdService)) {
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

    const user = await this.#service.handler(id);

    response.json(user);
  }
}

export { GetUserByIdController };
