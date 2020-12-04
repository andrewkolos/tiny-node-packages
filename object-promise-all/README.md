## object-promise-all

Like `Promise.all`, but works on all objects, not just arrays.

## usage

```ts
import promiseAll from '@akolos/object-promise-all';

const obj = {
	prop1: Promise.resolve('prop1'),
	prop2: Promise.resolve('prop2'),
};

const resolved = await promiseAll(obj);
// resolved equals {prop1: 'prop1', prop2: 'prop2'}
```

The function also works with nested objects, arrays, and non-promise members.

```ts
const obj = {
	prop1: Promise.resolve('prop1'),
	arr: [
        	Promise.resolve('prop2'),
	        { prop3: Promise.resolve('prop3')},
	],
     notAPromise: 'prop4',
};

const resolved = await objectPromiseAll(obj);
/*
{
	prop1: 'prop1',
	arr: ['prop2', {prop3: 'prop3'}],
	notAPromise: 'prop4',
}
*/
```
