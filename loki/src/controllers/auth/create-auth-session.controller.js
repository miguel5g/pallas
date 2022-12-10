import { CreateAuthSessionService } from '../../services/auth/create-auth-session.service';
import { CredentialsSchema } from '../../validators';

const ONE_SECOND_IN_MS = 1000;
const ONE_MINUTE_IN_MS = ONE_SECOND_IN_MS * 60;
const ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * 60;
const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;

class CreateAuthSessionController {
  #service;

  /** @type {CreateAuthSessionService} */
  constructor(service) {
    if (!service || !(service instanceof CreateAuthSessionService)) {
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
    const { email, password } = request.body;

    const credentials = CredentialsSchema.parse({ email, password });

    const token = await this.#service.handler(credentials);

    return response
      .cookie('token', token, {
        path: '/',
        expires: new Date(Date.now() + ONE_DAY_IN_MS),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(201)
      .json({ message: 'Successfully authenticated' });
  }
}

export { CreateAuthSessionController };
