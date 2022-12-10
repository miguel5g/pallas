const Permissions = {
  DELETE_USER: 1 << 0,
  READ_USER: 1 << 1,
  UPDATE_USER: 1 << 2,
};
const PermissionsKeys = Object.keys(Permissions);

/**
 * @typedef {('DELETE_USER' | 'READ_USER' | 'UPDATE_USER')} PermissionsKeysType
 */

/**
 * @param {Array<PermissionsKeysType>} permissions
 * @returns {number}
 */
function calculatePermissions(permissions = []) {
  if (!Array.isArray(permissions)) throw new Error('Invalid permissions');

  permissions.forEach((permission) => {
    if (!PermissionsKeys.includes(permission)) throw new Error('Invalid permissions');
  });

  return permissions
    .map((permission) => Permissions[permission])
    .reduce((calculated, permission) => calculated | permission, 0);
}

/**
 * @param {number} target
 * @param {Array<PermissionsKeysType>} search
 */
function hasPermissions(target, search = []) {
  if (typeof target !== 'number') throw new Error('Invalid target permissions');

  if (!Array.isArray(search)) throw new Error('Invalid search permissions');

  search.forEach((permission) => {
    if (!PermissionsKeys.includes(permission)) throw new Error('Invalid search permissions');
  });

  return search
    .map((permission) => Permissions[permission])
    .some((permission) => (target & permission) === permission);
}

export { calculatePermissions, hasPermissions };
