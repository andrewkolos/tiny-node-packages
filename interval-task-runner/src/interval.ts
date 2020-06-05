/**
 * Represents an interval of time, i.e. the amount of time between two events.
 */
export class Interval {

  /**
   * Creates an `Interval` from a number of milliseconds that comprsises it.
   * @param ms The number of milliseconds that represents the interval.
   */
  public static fromMs(ms: number) {
    return new Interval(ms);
  }

  /**
   * Creates an `Interval` from the number of times this interval would ellapse within the span of a second.
   * @param hz The number of times this interval would ellapse within the span of a second.
   */
  public static fromHz(hz: number) {
    return new Interval(1000 / hz);
  }

  /**
   * @param ms The interval, in milliseconds-per-interval, that this object represents
   */
  private constructor(public ms: number) { }
}
