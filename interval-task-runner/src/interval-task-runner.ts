import { Interval } from './interval';

/**
 * Repeatedly executes a function, with a minimum time delay between each call.
 */
export class IntervalTaskRunner {

  private intervalId?: NodeJS.Timeout | number;
  private running: boolean = false;

  /**
   * @param task The task to be ran every time the interval ellapses.
   * @param interval The intervening time between `task` calls.
   */
  public constructor(private readonly task: () => void, private readonly interval: Interval) { }

  /**
   * Determines if this runner is running.
   * @returns `true` if running, `false` otherwise.
   */
  public isRunning(): boolean {
    return this.running;
  }

  /**
   * Starts the runner.
   */
  public start(): this {
    this.intervalId = setInterval(this.task, this.interval.ms);
    this.running = true;
    return this;
  }

  /**
   * Stops the runner.
   */
  public stop(): this {
    // TS compiler is unsure if we are using a Node interval or a web API interval.
    // Either is fine as both APIs are identical, so we perform a cast here.
    clearInterval(this.intervalId as NodeJS.Timeout & number);
    this.running = false;
    return this;
  }
}
