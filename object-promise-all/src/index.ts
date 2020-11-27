export type PromisesMap<T> = {
  [P in keyof T]: T[P] extends Promise<any> ? T[P] : T[P] extends object ? PromisesMap<T[P]> : T[P];
};

export type DePromiseProps<T extends PromisesMap<any>> = T extends PromisesMap<infer U>
  ? {
    [P in keyof U]: U[P] extends Promise<infer PR> ? PR : U[P] extends object ? DePromiseProps<U[P]> : U[P];
  }
  : never;

/**
 * Resolves all properties found within an object. Works recursively.
 * @param promisesMap The object. Can contain any type of property. Non-promise values are copied over, unchanged.
 * @return {Promise<T>} A promise that resolves to a version of the object with all promises within resolved.
 */
export function objectPromiseAll<T extends PromisesMap<T>>(promisesMap: T): Promise<DePromiseProps<T>> {
  if (promisesMap === null || typeof promisesMap !== 'object') {
    return Promise.reject(new TypeError('The input argument must be of type object'));
  }

  const keys = Object.keys(promisesMap);
  const promises = keys.map((key) => {
    const value = (promisesMap as any)[key];
    return isNonPromiseObject(value) ? objectPromiseAll(value) : value;
  });

  return Promise.all(promises).then((results) => {
    return results.reduce((resolved, result, index) => {
      resolved[keys[index]] = result;
      return resolved;
    }, {});
  });
}

function isPromise<T, S>(obj: PromiseLike<T> | S): obj is PromiseLike<T> {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof (obj as PromiseLike<T>).then === 'function'
  );
}

function isNonPromiseObject(obj: unknown): boolean {
  return typeof obj === 'object' && !isPromise(obj);
}