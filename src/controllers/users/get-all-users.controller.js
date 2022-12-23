import { UnauthorizedError } from '../../errors';
import { hasPermissions } from '../../libs/permissions';
import { GetAllUsersService } from '../../services/users/get-all-users.service';

class GetAllUsersController {
  /** @type {GetAllUsersService} */
  #service;

  /**
   * @param {GetAllUsersService} service
   */
  constructor(service) {
    if (!service || !(service instanceof GetAllUsersService)) {
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
    const userPermissions = request.user?.permissions;

    if (!userPermissions || !hasPermissions(userPermissions, ['READ_USER'])) {
      throw new UnauthorizedError();
    }

    const { page: queryPage } = request.query;

    const page = Array.isArray(queryPage) ? +queryPage[0] : +queryPage;

    const users = await this.#service.handler(page);

    return response.json(users);
  }
}

export { GetAllUsersController };
