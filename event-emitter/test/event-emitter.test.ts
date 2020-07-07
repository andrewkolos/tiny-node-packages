import { EventEmitter } from '../src/event-emitter';

interface ObservableFooEvents {
  foo: (fooCount: number) => void;
  broadcast: (text: string) => void;
}

class ObservableFooer extends EventEmitter<ObservableFooEvents> {
  private fooCount = 0;

  public methodThatFiresFooEvent() {
    this.fooCount++;
    this.emit('foo', this.fooCount);
  }

  public methodThatFiresBroadcastEvent(text: string) {
    this.emit('broadcast', text);
  }
}

describe(nameof(EventEmitter), () => {
  it('calls a listener listening to a specific event when it is fired', () => {
    const fooer = new ObservableFooer();
    const fn = jest.fn();
    fooer.on('foo', fn);
    fooer.methodThatFiresFooEvent();
    expect(fn).toBeCalledWith([1]);
  });

  it('calls all event listeners listening to a specific event', () => {
    const fooer = new ObservableFooer();
    const fns = [...Array(10).keys()].map(() => {
      const fn = jest.fn();
      fooer.on('foo', fn);
      return fn;
    });

    fooer.methodThatFiresFooEvent();

    fns.forEach((fn) => expect(fn).toHaveBeenCalledWith([1]));
  });

  it('does not call listeners listening to a different event than the one fired', () => {
    const fooer = new ObservableFooer();
    const fooListener = jest.fn();
    fooer.on('foo', fooListener);
    const broadcastListener = jest.fn();
    fooer.on('broadcast', broadcastListener);

    fooer.methodThatFiresFooEvent();
    expect(fooListener).toHaveBeenCalledTimes(1);
    expect(broadcastListener).toHaveBeenCalledTimes(0);

    fooer.methodThatFiresBroadcastEvent('hello');
    expect(fooListener).toHaveBeenCalledTimes(1);
    expect(broadcastListener).toHaveBeenCalledTimes(1);
  });

  it('when instructed to remove a listener, removes the correct listener and only that listener', () => {
    const fooer = new ObservableFooer();
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();

    [listener1, listener2, listener3].forEach((l) => fooer.on('foo', l));

    fooer.off('foo', listener2);
    fooer.methodThatFiresFooEvent();

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(0);
    expect(listener3).toHaveBeenCalledTimes(1);
  });

  it('allows for method chaining', () => {
    const fooer = new ObservableFooer();
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();

    fooer
      .on('foo', listener1)
      .on('foo', listener2)
      .on('foo', listener3)
      .off('foo', listener2);

    fooer.methodThatFiresFooEvent();

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(0);
    expect(listener3).toHaveBeenCalledTimes(1);
  });
});
