import { HandlerNotFoundError } from 'handler-not-found-error';

/**
 * Similar to the NodeJS EventEmitter.
 */
export class PublicEventEmitter<T extends { [K in keyof T]: (...args: any) => any; }> {

  private handlers: Record<keyof T, T[keyof T][]> = {} as any;

  /**
   * Registers a handler for an event.
   * @param event The event to listen to.
   * @param handler The handler that will be called when the event is fired.
   * @returns This.
   */
  public on(event: keyof T, handler: T[keyof T]): this {
    const eventHandlers = this.handlers[event] == null ? [] as T[keyof T][] : this.handlers[event];
    eventHandlers.push(handler);
    this.handlers[event] = eventHandlers;
    return this;
  }

  /**
   * Removes/deregisters an existing handler for an event.
   * @param event The event that the handler is listening to.
   * @param handler The handler to remove.
   * @returns This.
   */
  public off(event: keyof T, handler: T[keyof T]): this {
    if (handler == null) {
      return this;
    }

    const eventHandlers = this.handlers[event];
    const indexOfHandler = eventHandlers.indexOf(handler);
    if (indexOfHandler === -1) {
      throw new HandlerNotFoundError('Handler to remove was not found.');
    }
    eventHandlers.splice(indexOfHandler, 1);

    return this;
  }

  /** 
   * Raises an event, calling all handlers registered to it with the provided arguments. 
   * @param event The event to raise.
   * @param args The arguments to pass each handler.
   * @returns This. 
   */
  public emit(event: keyof T, ...args: Parameters<T[keyof T]>): this {
    const eventHandlers = this.handlers[event];

    if (!eventHandlers) {
      return this;
    }

    eventHandlers.forEach((handler: T[keyof T]) => handler(args));
    return this;
  }
}
