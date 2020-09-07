export type Events<T> = { [K in keyof T]: (...args: any[]) => any; };
