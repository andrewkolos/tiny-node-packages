import { EventEmitter } from '../src/event-emitter';

interface FooEvents {
  num: [fooCount: number];
  str: [text: string];
  multi: [fooCount: number, text: string];
}

describe(nameof(EventEmitter), () => {

  it('correctly maintains the count of listeners for events', () => {
    const emitter = new EventEmitter<FooEvents>();
    for (let i = 1; i <= 10; i++) {
      emitter.on('num', () => { });
      expect(emitter.listenerCount('num')).toBe(i);
    }
  });

  it('correctly gives a protected version when asked (hides emit method)', () => {
    const emitter = new EventEmitter<FooEvents>();
    const protectedVersion = emitter.asProtected();
    const asUnprotected = protectedVersion as EventEmitter<FooEvents>;
    expect(() => asUnprotected.emit('num', 0)).toThrow();
  });

  describe('makeDelegate', () => {
    it(`delegate correctly delegates calls to 'on' to the emitter`, () => {
      const expectedSelf = { foo: 3 };
      const emitter = new EventEmitter<FooEvents>();
      const on = emitter.makeDelegate('on', expectedSelf);
      const listener = jest.fn();

      const self = on('num', listener);
      emitter.emit('num', 1);

      expect(listener).toBeCalled();
      expect(self).toBe(expectedSelf);
    });

    it(`correctly delegates calls to 'off' to the original emitter`, () => {

      const expectedSelf = { foo: 3 };
      const emitter = new EventEmitter<FooEvents>();
      const off = emitter.makeDelegate('off', expectedSelf);

      const listener = jest.fn();
      emitter.on('num', listener);
      const self = off('num', listener);
      emitter.emit('num', 1);

      expect(listener).toBeCalledTimes(0);
      expect(self).toBe(expectedSelf);
    });

    it(`correctly delegates calls to 'emit' to the emitter`, () => {
      const expectedSelf = { foo: 3 };
      const emitter = new EventEmitter<FooEvents>();
      const emit = emitter.makeDelegate('emit', expectedSelf);

      const listener = jest.fn();
      emitter.on('num', listener);
      const self = emit('num', 1);

      expect(listener).toBeCalledTimes(1);
      expect(self).toBe(expectedSelf);
    });
  })
});
