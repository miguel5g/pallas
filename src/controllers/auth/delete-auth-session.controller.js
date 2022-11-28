class DeleteAuthSessionController {
  constructor() {
    this.handler = this.handler.bind();
  }

  /**
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @returns {Promise<void>}
   */
  async handler(_request, response) {
    return response
      .cookie('token', '', {
        expires: new Date(),
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ message: 'Session deleted successfully' });
  }
}

export { DeleteAuthSessionController };
