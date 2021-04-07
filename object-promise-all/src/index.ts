export type PromisesMap<T> = {
  [P in keyof T]: T[P] extends Promise<any> ? T[P] :
  T[P] extends object ? PromisesMap<T[P]> :
  T[P];
};

export type DePromiseProps<T> = ExpandRecursively<FilterNever<_DePromisePropsStart<T>>>;

type _DePromisePropsStart<T> = T extends Promise<any> ? never : _DePromiseProps<T>;

type _DePromiseProps<T> = ExpandRecursively<FilterNever<
  T extends Promise<infer P> ? P : (
    T extends Array<infer A> ? Array<_DePromiseProps<A>> : (
      IsFunction<T> extends true ? never : (
        T extends object ? { [K in keyof T]: _DePromiseProps<T[K]>; } : T
      )
    )
  )
>>;

type IsFunction<T> = T extends (...args: any) => any ? true : false;

type FilterNever<T> = T extends Array<any> ? T : T extends object
  ? T extends infer O ? { [K in keyof O as O[K] extends never ? never : K]: O[K] } : never : T;

type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;


/**
 * Resolves all properties found within an object. Works recursively.
 * @param promisesMap The object. Can contain any type of property. Non-promise values are copied over, unchanged.
 * @return {Promise<T>} A promise that resolves to a version of the object with all promises within resolved.
 */
export function objectPromiseAll<T extends PromisesMap<T>>(promisesMap: T): Promise<DePromiseProps<T>> {
  if (promisesMap === null || typeof promisesMap !== 'object' || promisesMap instanceof Promise) {
    return Promise.reject(new TypeError('The input argument must be of type object'));
  }

  const keys = Object.keys(promisesMap);
  const promises = keys.map((key) => {
    const value = (promisesMap as any)[key];
    return isNonPromiseObject(value) ? objectPromiseAll(value) : value;
  });

  return Promise.all(promises).then((results) => {
    return results.reduce((resolved, result, index) => {
      if ((typeof result !== 'function')) {
        resolved[keys[index]] = result;
      }
      return resolved;
    }, Array.isArray(promisesMap) ? [] : {});
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

export default objectPromiseAll;
