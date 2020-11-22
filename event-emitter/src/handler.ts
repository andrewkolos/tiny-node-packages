import { Events } from './events';
import { UnionToIntersection } from './union-to-intersection';

export type Handler<E extends Events<E>, EventName extends keyof E> = E extends unknown ? (...args: UnionToIntersection<E[EventName]>) => void : never;
export type HandlerParams<T extends Events<T>, K extends keyof T> = T extends unknown ? UnionToIntersection<T[K]> : never;
