import { HandlerNotFoundError } from './handler-not-found-error';

/**
 * Similar to the NodeJS EventEmitter.
 */
export class PublicEventEmitter<T extends { [K in keyof T]: (...args: any[]) => any; }> {

  private listeners: Record<keyof T, T[keyof T][]> = {} as any;

  /**
   * Registers a handler for an event.
   * @param eventName The event to listen to.
   * @param handler The handler that will be called when the event is fired.
   * @returns This.
   */
  public on<K extends keyof T>(eventName: K, handler: T[K]): this {
    const eventHandlers = this.listeners[eventName] == null ? [] as T[keyof T][] : this.listeners[eventName];
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
  public off<K extends keyof T>(eventName: K, handler: T[K]): this {
    if (handler == null) {
      return this;
    }

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
  public emit<K extends keyof T>(eventName: K, ...args: Parameters<T[K]>): this {
    const listeners = this.listeners[eventName];

    if (!listeners) {
      return this;
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
