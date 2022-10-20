import bcrypt from 'bcrypt';

const SALT_ROUNDS = +process.env.SALT_ROUNDS;

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

  if (!SALT_ROUNDS) throw new Error('Invalid salt rounds');

  return bcrypt.hash(text, SALT_ROUNDS);
}

export { compareText, hashText };
