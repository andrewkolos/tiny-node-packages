import { cloneDumbObject, compareDumbObjects } from '../src/index';

describe(nameof(cloneDumbObject), () => {
  it('clones a valid dumb object accurately', () => {
    const object = {
      string: 'foo',
      boolean: true,
      number: 1,
      null: null,
      undef: undefined,
    };

    const clone = cloneDumbObject(object);

    expect(clone).toEqual(object);
  });

  it('creates a new object so as to prevent mutation of the original object when mutating the clone', () => {
    const object = {
      fizz: 1,
      buzz: '2',
    };

    const clone = cloneDumbObject(object);

    clone.fizz = 3;

    expect(object.fizz).toEqual(1);
  });

  it('errors when object contains a function', () => {
    expect(() =>
      cloneDumbObject({
        notafunction: 1,
        afunction: () => 3,
      })
    ).toThrow();
  });
});

describe(nameof(compareDumbObjects), () => {
  it('errors when object contains a function', () => {
    const object = {
      foo: 1,
    };

    const badObject = {
      func: () => 3,
    };

    expect(() => compareDumbObjects(object, badObject as any)).toThrow();
    expect(() => compareDumbObjects(badObject, object as any)).toThrow();
  });

  it('correctly identifies two identical objects', () => {
    const o1 = {
      string: 'foo',
      boolean: true,
      number: 1,
      null: null,
      undef: undefined,
    };

    const o2 = {
      string: 'foo',
      boolean: true,
      number: 1,
      null: null,
      undef: undefined,
    };

    expect(compareDumbObjects(o1, o2)).toEqual(true);
  });

  it('correctly identifies two objects as not equal', () => {
    const object = {
      string: 'foo',
      boolean: true,
      number: 1,
      null: null,
      undef: undefined,
    };

    const mutations = [
      { string: 'different' },
      { boolean: false },
      { number: 123 },
    ];

    mutations.forEach(mut => {
      let other = cloneDumbObject(object);
      other = Object.assign(other, mut);
      expect(compareDumbObjects(object, other)).toEqual(false);
    });
  });
});
