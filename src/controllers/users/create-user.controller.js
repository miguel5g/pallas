import { sendMail } from '../../libs/send-mail';
import { CreateUserService } from '../../services/users/create-user.service';
import { CreateUserSchema } from '../../validators';

class CreateUserController {
  /** @type {CreateUserService} */
  #service;

  /**
   * @param {CreateUserService} service
   */
  constructor(service) {
    if (!service || !(service instanceof CreateUserService)) {
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
    const { name, surname, email, password } = request.body;

    const user = CreateUserSchema.parse({ name, surname, email, password });

    await this.#service.handler(user);

    response.status(201).json({ message: 'User created successfully' });

    await sendMail('welcome', { to: email, name });
  }
}

export { CreateUserController };
