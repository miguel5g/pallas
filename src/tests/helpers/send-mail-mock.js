import { jest } from '@jest/globals';

jest.mock('../../libs/send-mail', () => ({
  __esModule: true,
  sendMail: jest.fn(),
}));
