import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { decode, encode } from './token';

describe('libs/token', () => {
  const systemTime = new Date(2022, 9, 29, 12);
  const ONE_SECOND_IN_MS = 1000;
  const ONE_MINUTE_IN_MS = ONE_SECOND_IN_MS * 60;
  const ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * 60;
  const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(systemTime);
    process.env.SECRET = 'super-secret';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('decode', () => {
    it('should be a function', () => {
      expect(encode).toBeInstanceOf(Function);
    });

    it('should throw an error if secret is not defined', () => {
      delete process.env.SECRET;

      expect(() => decode()).toThrow('Secret must be defined');
    });

    it('should return token payload', () => {
      const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
      const input = jwt.sign({ hello: 'World' }, process.env.SECRET, { expiresIn: '1d' });
      const output = decode(input);

      expect(output).toEqual({
        hello: 'World',
        iat: Date.now() / 1000,
        exp: (Date.now() + ONE_DAY_IN_MS) / 1000,
      });
    });

    it('should throw token expired error when token is expired', () => {
      const input = jwt.sign({ hello: 'World' }, process.env.SECRET, { expiresIn: '1d' });

      jest.setSystemTime(new Date(systemTime.getTime() + ONE_DAY_IN_MS));

      expect(() => decode(input)).toThrowError(TokenExpiredError);
    });

    it('should throw jwt error when token is malformed', () => {
      try {
        decode('invalid');
      } catch (error) {
        expect(error).toBeInstanceOf(JsonWebTokenError);
        expect(error.message).toBe('jwt malformed');
      }
    });

    it('should throw jwt error when token is malformed', () => {
      try {
        decode('other.invalid.token');
      } catch (error) {
        expect(error).toBeInstanceOf(JsonWebTokenError);
        expect(error.message).toBe('invalid token');
      }
    });
  });

  describe('encode', () => {
    it('should be a function', () => {
      expect(encode).toBeInstanceOf(Function);
    });

    it('should throw an error if secret is not defined', () => {
      delete process.env.SECRET;

      expect(() => encode()).toThrow('Secret must be defined');
    });

    it('should throw an error if payload is not passed', () => {
      process.env.SECRET = undefined;

      expect(() => encode()).toThrow('Payload is required');
    });

    it('should returns an string token string', () => {
      process.env.SECRET = 'super-secret';

      const input = {};
      const output = encode(input);

      expect(typeof output).toBe('string');
      expect(output.split('.')).toHaveLength(3);
    });

    it('should have input payload inside token', () => {
      process.env.SECRET = 'super-secret';

      const input = { hello: 'World' };
      const output = encode(input);

      const payload = jwt.decode(output);

      expect(payload).toEqual({
        hello: 'World',
        iat: Date.now() / 1000,
        exp: (Date.now() + ONE_DAY_IN_MS) / 1000,
      });
    });
  });
});
