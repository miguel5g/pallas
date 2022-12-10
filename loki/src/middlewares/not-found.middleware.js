class NotFoundMiddleware {
  constructor() {
    this.handler = this.handler.bind(this);
  }

  /**
   * @param {import('express').Request} _request
   * @param {import('express').Response} response
   * @returns {Promise<void>}
   */
  handler(_request, response) {
    return response.status(404).json({ message: 'Resource not found' });
  }
}

export { NotFoundMiddleware };
