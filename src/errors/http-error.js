class HttpError extends Error {
  /** @type {number} */
  statusCode;

  constructor(message, statusCode) {
    if (!message || !statusCode) {
      throw new Error('Invalid error props');
    }

    super(message);

    this.statusCode = statusCode;
  }
}

export { HttpError };
