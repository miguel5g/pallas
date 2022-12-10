const messages = {
  invalid_type: (path) => `The "${path}" field must be a string`,
  require: (path) => `The "${path}" field is mandatory`,
  too_small: (path) => `The minimum length of the "${path}" field is 6 characters`,
  too_big: (path) => `The maximum length of the "${path}" field is 24 characters`,
  invalid_string_email: (path) => `The "${path}" field must be a valid email`,
};

function parserMessage({ code, message: defaultMessage, path, validation }) {
  const key = validation ? `${code}_${validation}` : code;
  const message = messages[key];

  return {
    code: key,
    message: message ? message(path) : defaultMessage,
  };
}

export { parserMessage };
