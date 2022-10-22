import { describe, expect, it } from '@jest/globals';

import { calculatePermissions, hasPermissions } from './permissions';

describe('libs/permissions', () => {
  describe('calculate-permissions', () => {
    it('should be an instance of a function', () => {
      expect(calculatePermissions).toBeInstanceOf(Function);
    });

    it('should return zero on not receiving any permissions', () => {
      const output = calculatePermissions();

      expect(output).toBe(0);
    });

    it('should throw an error on receiving an invalid permission', () => {
      {
        expect(() => calculatePermissions(null)).toThrow('Invalid permissions');
      }
      {
        expect(() => calculatePermissions(['invalid'])).toThrow('Invalid permissions');
      }
    });

    it('should return calculated permissions', () => {
      const output = calculatePermissions(['DELETE_USER', 'READ_USER']);

      expect(output).toBe(3);
    });
  });

  describe('has-permissions', () => {
    it('should be an instance of a function', () => {
      expect(hasPermissions).toBeInstanceOf(Function);
    });

    it('should throw an error on receiving an invalid target permissions', () => {
      expect(() => hasPermissions(null)).toThrow('Invalid target permissions');
    });

    it('should throw an error on receiving an invalid search permissions', () => {
      {
        expect(() => hasPermissions(5, null)).toThrow('Invalid search permissions');
      }
      {
        expect(() => hasPermissions(5, ['invalid'])).toThrow('Invalid search permissions');
      }
    });

    it('should return true if the target has some of the searched permissions', () => {
      {
        const output = hasPermissions(3, ['READ_USER']);

        expect(output).toBe(true);
      }
      {
        const output = hasPermissions(3, ['DELETE_USER']);

        expect(output).toBe(true);
      }
    });

    it("should return false if the target doesn't have some of the searched permissions", () => {
      const output = hasPermissions(3, ['UPDATE_USER']);

      expect(output).toBe(false);
    });
  });
});
