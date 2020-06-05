# IntervalTaskRunner

Repeatedly executes a function with a minimum time delay between reach call (with millisecond precision). Written in TypeScript.

# Installation and Usage

## Install
```
npm install interval-task-runner
```

## Example Usages
```JS
import { IntervalTaskRunner, Interval } from 'interval-task-runner';

const task = () => console.log('foo'); // The task to run.

// example 1
const interval = Interval.fromHz(10); // Run task approx. 10 times per second.
const runner = new IntervalTaskRunner(task, interval);
runner.start(); // Now printing 'foo' ~10 times per second.
// Later...
runner.stop(); // No longer printing 'foo'.

// example 2
const interval = Interval.fromMs(100); // Run task approx. every 100 milliseconds (or 10 Hz).
const runner = new IntervalTaskRunner(task, interval).start(); // One-liner.
runner.stop();
```
# [API](https://github.com/andrewkolos/interval-task-runner/tree/master/docs/classes)