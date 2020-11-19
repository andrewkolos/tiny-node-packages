
import { EventSource } from './event-source';
import { Events } from './events';

/**
 * Similar to the NodeJS EventEmitter.
 */
export class EventEmitter<T extends Events<T>> implements EventSource<T> {

  private listeners: { [K in keyof T]: Array<(...args: T[K]) => void> } = {} as any;

  /**
   * Registers a handler for an event.
   */
  public on<K extends keyof T>(eventName: K, handler: (...args: T[K]) => void): this {
    const eventHandlers = this.listeners[eventName] == null ?
      [] as Array<(...args: T[K]) => void>
      : this.listeners[eventName];
    eventHandlers.push(handler);
    this.listeners[eventName] = eventHandlers;
    return this;
  }

  /**
   * Removes/deregisters an existing handler for an event.
   */
  public off<K extends keyof T>(eventName: K, handler: (...args: T[K]) => void): this {
    if (handler == null) return this;

    const eventHandlers = this.listeners[eventName];
    const indexOfHandler = eventHandlers.indexOf(handler);
    if (indexOfHandler === -1) {
      throw new Error('Handler to remove was not found.');
    }
    eventHandlers.splice(indexOfHandler, 1);
    return this;
  }

  /**
   * Raises an event, calling all listeners registered to it with the provided arguments.
   */
  public emit<K extends keyof T>(eventName: K, ...args: T[K]): this {
    const listeners = this.listeners[eventName];

    if (listeners == null) {
      return this;
    }

    listeners.forEach((handler: (...args: T[K]) => void) => handler(...args));
    return this;
  }

  /**
   * A version of this event emitter with the `emit` method hidden.
   */
  public asProtected(): EventSource<T> {
    return {
      on: this.on.bind(this),
      off: this.off.bind(this),
    };
  };

  /**
   * Creates a wrapper/delegate method for the `on`/`off` method of this emitter that returns
   * `self` instead of the `EventEmitter` instance. Useful for exposing the `on`
   * method without exposing the entire emitter through the original method's self-return value.
   * @param methodName The method to create a delegate for.
   * @param self The value that the delegate will return.
   */
  public makeDelegate<Self>(methodName: 'on' | 'off', self: Self):
    <K extends keyof T>(eventName: K, handler: (...args: T[K]) => void) => Self;
  /**
   * Creates a wrapper/delegate method for the `emit` method of this emitter that returns
   * `self` instead of the `EventEmitter` instance. Useful for exposing the `on`
   * method without exposing the entire emitter through the original method's self-return value.
   * @param methodName The method to create a delegate for.
   * @param self The value that the delegate will return.
   */
  public makeDelegate<Self>(methodName: 'emit', self: Self):
    <K extends keyof T>(eventName: K, ...args: T[K]) => Self;

  /**
   * Creates a wrapper/delegate method for the one of the public methods of this emitter that returns
   * `self` instead of the `EventEmitter` instance. Useful for exposing the `on`
   * method without exposing the entire emitter through the original method's self-return value.
   * @param methodName The method to create a delegate for.
   * @param self The value that the delegate will return.
   */
  public makeDelegate<M extends 'on' | 'off' | 'emit', Self>(methodName: M, self: Self) {
    return (...args: Parameters<EventEmitter<T>[M]>) => {
      // The cast here is unavoidable because methodName could be any of the methods, which don't
      // have compatible method signatures (`emit` for example is unique).
      // As long as an overload is provided, things will typecheck correctly on the client's end,
      // but the implementation body is unaware of overloads and thus we need this cast
      // and future make delegate targets will need their own overloads--otherwise
      // makeDelegate might be uncallable (parameters will be of type never) due to TS attempting
      // to union the parameter types of all methods, which will be `never` due to lack of overlap.
      (this[methodName] as any)(...args);
      return self;
    }
  }

  /**
   * Gets the number of listeners listening to a specific event.
   * @param eventName The event.
   */
  public listenerCount(eventName: keyof T): number {
    return this.listeners[eventName] == null ? 0 : this.listeners[eventName].length;
  }
}
