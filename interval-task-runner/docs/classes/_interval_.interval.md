**[interval-task-runner](../README.md)**

[Globals](../README.md) › ["interval"](../modules/_interval_.md) › [Interval](_interval_.interval.md)

# Class: Interval

Represents an interval of time, i.e. the amount of time between two events.

## Hierarchy

* **Interval**

## Index

### Methods

* [fromHz](_interval_.interval.md#static-fromhz)
* [fromMs](_interval_.interval.md#static-fromms)

## Methods

### `Static` fromHz

▸ **fromHz**(`hz`: number): *[Interval](_interval_.interval.md)*

Defined in interval.ts:18

Creates an `Interval` from the number of times this interval would ellapse within the span of a second.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hz` | number | The number of times this interval would ellapse within the span of a second.  |

**Returns:** *[Interval](_interval_.interval.md)*

___

### `Static` fromMs

▸ **fromMs**(`ms`: number): *[Interval](_interval_.interval.md)*

Defined in interval.ts:10

Creates an `Interval` from a number of milliseconds that comprsises it.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`ms` | number | The number of milliseconds that represents the interval.  |

**Returns:** *[Interval](_interval_.interval.md)*