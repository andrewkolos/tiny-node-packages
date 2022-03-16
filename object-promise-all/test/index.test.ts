import { objectPromiseAll } from '../src/index';

describe('objectPromiseAll', () => {

  it('works on basic shallow objects', async () => {
    const obj = {
      prop1: Promise.resolve('prop1'),
      prop2: Promise.resolve('prop2'),
    };

    const resolved = await objectPromiseAll(obj);

    expect(resolved.prop1).toEqual('prop1');
    expect(resolved.prop2).toEqual('prop2');
    expect.assertions(2)
  });

  it('works on objects containing non-promises', async () => {
    const obj = {
      prop1: 'prop1',
      prop2: Promise.resolve('prop2'),
    };

    const resolved = await objectPromiseAll(obj);

    expect(resolved.prop1).toEqual('prop1');
    expect(resolved.prop2).toEqual('prop2');
    
    expect.assertions(2)
  });

  it('works on deep objects', async () => {
    const obj = {
      prop1: 'prop1',
      prop2: Promise.resolve('prop2'),
      prop3: {
        prop4: 'prop4',
        prop5: Promise.resolve('prop5'),
      }
    };

    const resolved = await objectPromiseAll(obj);

    expect(resolved.prop1).toEqual('prop1');
    expect(resolved.prop2).toEqual('prop2');
    expect(resolved.prop3).toEqual({
      prop4: 'prop4',
      prop5: 'prop5',
    });

    expect.assertions(3)
  });

  it('works on arrays', async () => {
    const obj: [Promise<string>, Promise<string>, string] =
      [Promise.resolve('prop1'), Promise.resolve('prop2'), 'prop3'];

    const resolved = await objectPromiseAll(obj);

    expect(resolved[0]).toEqual('prop1');
    expect(resolved[1]).toEqual('prop2');
    expect(resolved[2]).toEqual('prop3');

    expect(Array.isArray(resolved)).toBe(true);

    expect.assertions(4)
  });

  it('works on objects containing arrays', () => {
    const obj = {
      arr1: [Promise.resolve('prop1'), Promise.resolve('prop2')],
      notArr: Promise.resolve('prop3'),
    };

    return expect(objectPromiseAll(obj)).resolves.toEqual({
      arr1: ['prop1', 'prop2'],
      notArr: 'prop3',
    });
  });

  it('works on arrays containing objects', async () => {
    const obj = {
      prop1: Promise.resolve('prop1'),
      arr: [
        Promise.resolve('prop2'),
        {
          prop3: Promise.resolve('prop3'),
        },
      ],
      notAPromise: 'prop4',
    };

    const resolved = await objectPromiseAll(obj);

    expect(resolved).toEqual({
      prop1: 'prop1',
      arr: ['prop2', { prop3: 'prop3' }],
      notAPromise: 'prop4',
    });

    expect.assertions(1)
  });

  it('ignores functions', async () => {

    const date = new Date();
    const obj = {
      get getter() { return 2 },
      date,
      noFunctions: {
        a: 1,
        b: 2
      },
      func: () => 3
    };

    const resolved = await objectPromiseAll(obj);

    expect((resolved as typeof obj).func).toBeUndefined();
    expect(resolved).toEqual({
      getter: 2,
      date: {},
      noFunctions: {
        a: 1,
        b: 2
      }
    });
    expect.assertions(2)
  });

  it('should error for function input', async () => {
    const fn = () => 3;

    return expect(objectPromiseAll(fn)).rejects.toThrow();

    // @ts-ignore
    if (false) {
      // @ts-ignore
      const _f = await objectPromiseAll(fn); // For checking return type.
    }
  });

  it('should error for a bare promise', async () => {
    const p = Promise.resolve('s');
    return expect(objectPromiseAll(p)).rejects.toThrow();

    // @ts-ignore
    if (false) {
      // @ts-ignore
      const _f = await objectPromiseAll(p); // For checking return type.
    }
  });

  it('ignores functions at top level of array input', async () => {
    const obj = [1, () => 2];

    const resolved = await objectPromiseAll(obj);

    return expect(resolved).toEqual([1]);
  });
});
