import { Events } from './events';

export interface EventSource<T extends Events<T>> {
  on<K extends keyof T>(eventName: K, handler: (...args: T[K]) => void): this;
  off<K extends keyof T>(eventName: K, handler: (...args: T[K]) => void): this
}
