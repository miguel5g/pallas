import jwt from 'jsonwebtoken';

function decode(token) {
  const { SECRET } = process.env;

  if (!SECRET) throw new Error('Secret must be defined');

  return jwt.verify(token, SECRET);
}

function encode(payload) {
  const { SECRET } = process.env;

  if (!SECRET) throw new Error('Secret must be defined');

  if (!payload) throw new Error('Payload is required');

  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

export { decode, encode };
