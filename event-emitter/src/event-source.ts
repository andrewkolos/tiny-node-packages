import { Events } from './events';
import { Handler } from './handler';

export interface EventSource<T extends Events<T>> {
  on<K extends keyof T>(eventName: K, handler: Handler<T, K>): this;
  off<K extends keyof T>(eventName: K, handler: Handler<T, K>): this
}
