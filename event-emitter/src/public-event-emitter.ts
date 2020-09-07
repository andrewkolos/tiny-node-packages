import { HandlerNotFoundError } from './handler-not-found-error';
import { Events } from './events';

/**
 * Similar to the NodeJS EventEmitter.
 */
export class PublicEventEmitter<T extends Events<T>> {

  /**
   * Creates a wrapper/delegate method for the `on` method of an event emitter that returns
   * `self` instead of the `PublicEventEmitter` instance. Useful for exposing the `on`
   * method without exposing the entire emitter through `on`'s return value.
   * @param ee The event emitter to create the `on` wrapper for.
   * @param self The value that will be returned by the wrapper when invoked.
   */
  public static makeOnDelegate<T extends { [K in keyof T]: (...args: any[]) => any; },
    Self>(ee: PublicEventEmitter<T>, self: Self) {
    return <K extends keyof T>(eventName: K, handler: T[K]) => {
      ee.on(eventName, handler);
      return self;
    }
  }

  /**
   * Creates a wrapper/delegate method for the `off` method of an event emitter that returns
   * `self` instead of the `PublicEventEmitter` instance. Useful for exposing the `off`
   * method without exposing the entire emitter through `off`'s return value.
   * @param ee The event emitter to create the `off` wrapper for.
   * @param self The value that will be returned by the wrapper when invoked.
   */
  public static makeOffDelegate<T extends { [K in keyof T]: (...args: any[]) => any; },
    Self>(ee: PublicEventEmitter<T>, self: Self) {
    return <K extends keyof T>(eventName: K, handler: T[K]) => {
      ee.off(eventName, handler);
      return self;
    }
  }

  private listeners: { [K in keyof T]: T[K][] } = {} as any;

  /**
   * No-op. Returns this event emitter, adding new event types.
   */
  public extend<U extends { [K in keyof U]: (...args: any[]) => any }>(): PublicEventEmitter<T & U> {
    return this as unknown as PublicEventEmitter<T & U>;
  }

  /**
   * Registers a handler for an event.
   * @param eventName The event to listen to.
   * @param handler The handler that will be called when the event is fired.
   * @returns This.
   */
  public on<K extends keyof T>(eventName: K, handler: T[K]) {
    const eventHandlers = this.listeners[eventName] == null ? [] as T[K][] : this.listeners[eventName];
    eventHandlers.push(handler);
    this.listeners[eventName] = eventHandlers;
    return this;
  }

  /**
   * Removes/deregisters an existing handler for an event.
   * @param eventName The event that the handler is listening to.
   * @param handler The handler to remove.
   * @returns This.
   */
  public off<K extends keyof T>(eventName: K, handler: T[K]) {
    if (handler == null) return;

    const eventHandlers = this.listeners[eventName];
    const indexOfHandler = eventHandlers.indexOf(handler);
    if (indexOfHandler === -1) {
      throw new HandlerNotFoundError('Handler to remove was not found.');
    }
    eventHandlers.splice(indexOfHandler, 1);
    return this;
  }

  /**
   * Raises an event, calling all listeners registered to it with the provided arguments.
   * @param eventName The event to raise.
   * @param args The arguments to pass each handler.
   * @returns This.
   */
  public emit<K extends keyof T>(eventName: K, ...args: Parameters<T[K]>) {
    const listeners = this.listeners[eventName];

    if (listeners == null) {
      return;
    }

    listeners.forEach((handler: T[keyof T]) => handler(...args));
    return this;
  }

  /**
   * Gets the number of listeners listening to a specific event.
   * @param eventName The event.
   */
  public listenerCount(eventName: keyof T): number {
    return this.listeners[eventName] == null ? 0 : this.listeners[eventName].length;
  }
}
