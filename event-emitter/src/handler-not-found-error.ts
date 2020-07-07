import { CustomError } from '@akolos/custom-error';

/**
 * Error indicating that a handler to be acted upon/with was not found.
 */
export class HandlerNotFoundError extends CustomError {
  public constructor(message?: string) {
    super(message);
    this.name = 'HandlerNotFoundError';
  }
}
