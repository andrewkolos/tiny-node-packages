import { CustomError } from '../src/custom-error';

class MyTestError extends CustomError {

  public static eName = "MyTestError";

  public constructor(message?: string) {
    super(message);
    this.name = MyTestError.eName;
  }
}

describe(nameof(CustomError), () => {
  it('using instanceof to detect error type works', () => {
    try {
      throw new MyTestError('test');
    } catch (e) {
      expect(e instanceof MyTestError).toEqual(true);
    }
  });

});
