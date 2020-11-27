import { objectPromiseAll } from '../src/index';

describe(nameof(objectPromiseAll), () => {
  it('works on basic shallow objects', async (done) => {
    const obj = {
      prop1: Promise.resolve('prop1'),
      prop2: Promise.resolve('prop2'),
    };

    const resolved = await objectPromiseAll(obj);

    expect(resolved.prop1).toEqual('prop1');
    expect(resolved.prop2).toEqual('prop2');

    done();
  });

  it('works on objects containing non-promises', async (done) => {
    const obj = {
      prop1: 'prop1',
      prop2: Promise.resolve('prop2'),
    };

    const resolved = await objectPromiseAll(obj);

    expect(resolved.prop1).toEqual('prop1');
    expect(resolved.prop2).toEqual('prop2');

    done();
  });

  it('works on deep objects', async (done) => {
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

    done();
  });

  it('works on arrays', async (done) => {
    const obj: [Promise<string>, Promise<string>, string] =
      [Promise.resolve('prop1'), Promise.resolve('prop2'), 'prop3'];

    const resolved = await objectPromiseAll(obj);

    expect(resolved[0]).toEqual('prop1');
    expect(resolved[1]).toEqual('prop2');
    expect(resolved[2]).toEqual('prop3');

    done();
  });
});
