import { PublicEventEmitter } from './public-event-emitter';

/**
 * Similar to the NodeJS EventEmitter. It is specifically meant for subclassing/inheritting from in TypeScript.
 */
export class EventEmitter<T extends { [K in keyof T]: (...args: any[]) => any; }> {
  private readonly internalEmitter = new PublicEventEmitter<T>();

  /**
   * Adds a handler for an event.
   * @param event The event to listen to.
   * @param handler The handler that will be called when the event is fired.
   * @returns This.
   */
  public on<K extends keyof T>(event: K, handler: T[K]): this {
    this.internalEmitter.on(event, handler);
    return this;
  }

  /**
   * Removes/deregisters an existing handler for an event.
   * @param event The event that the handler is listening to.
   * @param handler The handler to remove.
   * @throws An error if the provided handler could not be found.
   * @returns This.
   */
  public off<K extends keyof T>(event: K, handler: T[K]): this {
    this.internalEmitter.off(event, handler);
    return this;
  }

  /**
   * Raises an event, calling all handlers registered to it with the provided arguments.
   * @param event The event to raise.
   * @param args The arguments to pass each handler.
   * @returns This.
   */
  protected emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): this {
    this.internalEmitter.emit(event, ...args);
    return this;
  }
}
