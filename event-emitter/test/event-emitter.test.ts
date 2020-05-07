import { EventEmitter } from '../src/event-emitter';

interface ObservableFooEvents {
  foo: (fooCount: number) => void;
}

class ObservableFooer extends EventEmitter<ObservableFooEvents> {
  private fooCount = 0;

  public methodThatFiresFooEvent() {
    this.fooCount++;
    this.emit('foo', this.fooCount);
  }
}
