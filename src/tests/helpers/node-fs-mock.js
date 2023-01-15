import { jest } from '@jest/globals';

jest.mock('node:fs/promises', () => ({ readFile: jest.fn() }));
