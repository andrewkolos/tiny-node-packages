/**
 * A base class for custom error classes that restores the prototype chain that Error
 * breaks in its constructor.
 */
export class CustomError extends Error {
  public constructor(message?: string) {
    const actualProto = new.target.prototype;
    super(message);
    this.restorePrototypeChain(actualProto);
  }

  // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
  // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
  private restorePrototypeChain(actualProto: CustomError) {
    if (Object.setPrototypeOf != null) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      (this as any).__proto__ = actualProto;
    }
  }
}
