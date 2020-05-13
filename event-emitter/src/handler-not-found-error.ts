import { CustomError } from '@akolos/custom-error';

export class HandlerNotFoundError extends CustomError {
  public constructor(message?: string) {
    super(message);
    this.name = (nameof(HandlerNotFoundError));
  }
}
