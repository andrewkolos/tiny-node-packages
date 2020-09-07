import { PublicEventEmitter } from '../src/public-event-emitter';
import dedent from 'dedent';

interface FooEvents {
  num: (fooCount: number) => void;
  str: (text: string) => void;
  multi: (fooCount: number, text: string) => void;
}


describe(nameof(PublicEventEmitter), () => {

  it('correctly maintains the count of listeners for events', () => {
    const emitter = new PublicEventEmitter<FooEvents>();
    for (let i = 1; i <= 10; i++) {
      emitter.on('num', () => { });
      expect(emitter.listenerCount('num')).toBe(i);
    }
  });

  it(dedent`${nameof(PublicEventEmitter.makeOnDelegate)} correctly delegates
        adding event emitters to the original emitter`, () => {

    const expectedSelf = { foo: 3 };
    const emitter = new PublicEventEmitter<FooEvents>();
    const on = PublicEventEmitter.makeOnDelegate(emitter, expectedSelf);
    const listener = jest.fn();

    const self = on('num', listener);
    emitter.emit('num', 1);

    expect(listener).toBeCalled();
    expect(self).toBe(expectedSelf);
  });

  it(dedent`${nameof(PublicEventEmitter.makeOffDelegate)} correctly delegates adding 
      event emitters to the original emitter`, () => {

    const expectedSelf = { foo: 3 };
    const emitter = new PublicEventEmitter<FooEvents>();
    const off = PublicEventEmitter.makeOffDelegate(emitter, expectedSelf);

    const listener = jest.fn();
    emitter.on('num', listener);
    const self = off('num', listener);
    emitter.emit('num', 1);

    expect(listener).toBeCalledTimes(0);
    expect(self).toBe(expectedSelf);
  });
});
