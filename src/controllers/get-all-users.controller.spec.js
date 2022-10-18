import { describe, expect, it, beforeEach } from '@jest/globals';

import { GetAllUsersController } from './get-all-users.controller';

describe('GetAllUsersController.js', () => {
  /** @type {GetAllUsersController} */
  let controller;

  beforeEach(() => {
    controller = new GetAllUsersController();
  });

  it('should have a handler method', () => {
    expect(controller.handler).toBeDefined();
  });

  it.todo("should calls response.json with 'Under construction' message");
});
