**[interval-task-runner](../README.md)**

[Globals](../README.md) › ["interval-task-runner"](../modules/_interval_task_runner_.md) › [IntervalTaskRunner](_interval_task_runner_.intervaltaskrunner.md)

# Class: IntervalTaskRunner

Repeatedly executes a function, with a minimum time delay between each call.

## Hierarchy

* **IntervalTaskRunner**

## Index

### Constructors

* [constructor](_interval_task_runner_.intervaltaskrunner.md#constructor)

### Methods

* [isRunning](_interval_task_runner_.intervaltaskrunner.md#isrunning)
* [start](_interval_task_runner_.intervaltaskrunner.md#start)
* [stop](_interval_task_runner_.intervaltaskrunner.md#stop)

## Constructors

###  constructor

\+ **new IntervalTaskRunner**(`task`: function, `interval`: [Interval](_interval_.interval.md)): *[IntervalTaskRunner](_interval_task_runner_.intervaltaskrunner.md)*

Defined in interval-task-runner.ts:9

**Parameters:**

▪ **task**: *function*

The task to be ran every time the interval ellapses.

▸ (): *void*

▪ **interval**: *[Interval](_interval_.interval.md)*

The intervening time between `task` calls.

**Returns:** *[IntervalTaskRunner](_interval_task_runner_.intervaltaskrunner.md)*

## Methods

###  isRunning

▸ **isRunning**(): *boolean*

Defined in interval-task-runner.ts:21

Determines if this runner is running.

**Returns:** *boolean*

`true` if running, `false` otherwise.

___

###  start

▸ **start**(): *this*

Defined in interval-task-runner.ts:28

Starts the runner.

**Returns:** *this*

___

###  stop

▸ **stop**(): *this*

Defined in interval-task-runner.ts:37

Stops the runner.

**Returns:** *this*