import { IntervalTaskRunner, Interval } from '../src/index';

describe('IntervalTaskRunner', () => {
  it('should not run the task before the specified interval occurs', (done) => {

    const interval = Interval.fromHz(20);
    let lastCallAt = new Date().getTime();
    const check = () => {
      const now = new Date().getTime();
      const timeSinceLastCall = now - lastCallAt;
      lastCallAt = now;

      if (timeSinceLastCall < interval.ms) {
        return;
      }
    };
    new IntervalTaskRunner(check, interval).start();

    setTimeout(() => {
      done();
    }, interval.ms * 50);
  });

  it('should run the task the correct number of times within a given timespan', (done) => {
    const allowedMissingRuns = 1;
    const numberOfRuns = 20;

    const interval = Interval.fromHz(10);
    let counter = 0;
    const count = () => {
      counter += 1;
    }

    new IntervalTaskRunner(count, interval).start();

    setTimeout(() => {
      if (numberOfRuns - counter > allowedMissingRuns) {
        throw Error(`Ran ${counter} times instead of expected ${numberOfRuns}.`);
      } else {
        done();
      }
    }, interval.ms * (numberOfRuns + 1));
  });
});
