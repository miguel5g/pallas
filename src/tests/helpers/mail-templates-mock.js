import { jest } from '@jest/globals';

jest.mock('../../libs/mail-templates', () => ({
  __esModule: true,
  renderTemplate: jest.fn(),
}));
