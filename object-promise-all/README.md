# object-promise-all

Like `Promise.all`, but works on most objects, not just arrays.

Useful for creating a collection of labeled promises and doing something once they are all resolved. You don't have to worry about
maintaining array indices like with `Promise.all`.

## Usage

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

Do note that functions will be lost in the output, since the library can't be sure
that copying these functions is safe. If you disagree, please open an Issue to discuss.

```ts

const obj = {
	prop1: Promise.resolve('prop1'),
	date: new Date(),
	fn: () => 2,
	arr: [1, () => 1]
}

const resolved = await objectPromiseAll(obj);

/*
	typeof resolved = {
		prop1: string,
		date: {},
		arr: number[]
	}
 */

```