// src/shared/pick.ts
/**
 * Creates an object composed of the picked object properties.
 * @param obj The source object.
 * @param keys The property keys to pick.
 * @returns A new object with the picked properties.
 */
const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    // Check if the object is not null/undefined and has the key
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pick;
