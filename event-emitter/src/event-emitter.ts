import { HandlerNotFoundError } from 'handler-not-found-error';

/**
 * Similar to the NodeJS EventEmitter. It is specifically meant for subclassing/inheritting from in TypeScript.
 */
export class EventEmitter<T extends { [K in keyof T]: (...args: any) => any; }> {

  private handlers: { [K in keyof T]: Array<T[K]>; } = {} as any;

  /**
   * Adds a listener for an event.
   * @param event 
   * @param handler 
   */
  public on<K extends keyof T>(event: K, handler: T[K]): T[K] {
    const eventHandlers = this.handlers[event] == null ? [] : this.handlers[event];
    eventHandlers.push(handler);
    this.handlers[event] = eventHandlers;
    return handler;
  }

  public off<K extends keyof T>(event: K, handler: T[K]): void {
    if (handler == null)
      return;
    const eventHandlers = this.handlers[event];
    const indexOfHandler = eventHandlers.indexOf(handler);
    if (indexOfHandler === -1) {
      throw new HandlerNotFoundError('Handler to remove was not found.');
    }
    eventHandlers.splice(indexOfHandler, 1);
  }

  protected emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const eventHandlers = this.handlers[event];

    if (!eventHandlers) {
      return;
    }

    eventHandlers.forEach((handler: T[K]): void => handler(args));
  }
}
