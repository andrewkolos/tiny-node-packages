/**
 * Checks value-equality for any two objects. Neither object may contain
 * a function, bigint, nor symbol as a value.
 * @param o1 The first object.
 * @param o2 The second object.
 */
export function compareDumbObjects<T>(o1: T, o2: T) {
  isDumbObjectUnsafe(o1);
  isDumbObjectUnsafe(o2);
  return JSON.stringify(sortObject(o1)) === JSON.stringify(sortObject(o2));
}

/**
 * Clones an object. None of the properties of the object may be a function.
 * @param o The object to clone.
 */
export function cloneDumbObject<T>(o: T): T {
  if (o == null) return o;
  isDumbObjectUnsafe(o);
  return JSON.parse(JSON.stringify(o));
}

function sortObject(object: any) {
  const result = {} as any;
  // Object.keys defines a traversal order, so we do not need to perform an additional sort.
  // https://stackoverflow.com/a/31102605
  Object.keys(object).forEach(function (key) {
    result[key] = object[key];
  });
  return result;
}

/**
 * Checks that every value within an object is cloneable.
 * @param o The object to check.
 */
function isDumbObject(o: Object): boolean {
  return Object.values(o).every((value: any) => {
    const t = typeof value;
    return t !== 'function' && t !== 'bigint' && t !== 'symbol';
  });
}

/**
 * Checks that every value within an object is not a function,
 * throwing an Error if this is not the case.
 * @param o The object to check.
 */
function isDumbObjectUnsafe(o: Object): void | never {
  if (!isDumbObject(o)) {
    throw Error('Object cannot contain non-value types.');
  }
}
