/* eslint-disable object-curly-newline */
import { jest } from '@jest/globals';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({ sendMail: jest.fn() }),
}));
