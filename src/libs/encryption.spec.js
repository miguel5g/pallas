import bcrypt from 'bcrypt';
import { describe, expect, it } from '@jest/globals';

import { compareText, hashText } from './encryption';

describe('libs/encryption', () => {
  describe('compare-text', () => {
    const validHash = bcrypt.hashSync('valid', 10);

    it("should throws an error if received hash isn't an string", async () => {
      expect(compareText(undefined, 'valid')).rejects.toThrow('Invalid hash value');
    });

    it("should throws an error if received text isn't an string", async () => {
      expect(compareText('valid', undefined)).rejects.toThrow('Invalid text value');
    });

    it('should returns true if the hash is equal to text', async () => {
      expect(compareText(validHash, 'valid')).resolves.toBe(true);
    });

    it("should returns true if the hash isn't equal to text", async () => {
      expect(compareText(validHash, 'invalid')).resolves.toBe(false);
    });
  });

  describe('hash-text', () => {
    it("should throws an error if received text isn't an string", async () => {
      expect(hashText(undefined)).rejects.toThrow('Invalid text value');
    });

    it("should throws an error if salt rounds isn't an number", async () => {
      {
        process.env.SALT_ROUNDS = undefined;

        expect(hashText('valid')).rejects.toThrow('Invalid salt rounds');
      }
      {
        process.env.SALT_ROUNDS = 'text';

        expect(hashText('valid')).rejects.toThrow('Invalid salt rounds');
      }
    });

    it('should return an hashed string', async () => {
      process.env.SALT_ROUNDS = '10';
      const input = 'valid';
      const output = await hashText(input);

      expect(await bcrypt.compare(input, output)).toBe(true);
    });
  });
});
