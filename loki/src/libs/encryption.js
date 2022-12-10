import bcrypt from 'bcrypt';

/**
 * @param {string} hash
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function compareText(hash, text) {
  if (!hash || typeof hash !== 'string') throw new Error('Invalid hash value');

  if (!text || typeof text !== 'string') throw new Error('Invalid text value');

  return bcrypt.compare(text, hash);
}

/**
 * @param {string} text
 * @returns {Promise<string>}
 */
async function hashText(text) {
  if (!text || typeof text !== 'string') throw new Error('Invalid text value');

  const saltRounds = +process.env.SALT_ROUNDS;

  if (!saltRounds) throw new Error('Invalid salt rounds');

  return bcrypt.hash(text, saltRounds);
}

export { compareText, hashText };
