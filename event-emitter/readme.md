# event-emitter

A strongly-typed Node-style event emitter written in TypeScript.

## Usage

### EventEmitter
```ts
import { EventEmitter } from '@akolos/event-emitter';

export interface MyEvents {
  eventOne: (fooCount: number) => void;
  eventTwo: (fooCount: number, fooText: string) => void;
}

const emitter = new EventEmitter<MyEvents>();
emitter.on('eventOne', (fooCount: number) => console.log(fooCount));
emitter.emit('eventOne', 1);

emitter.on('eventTwo', (fooCount: number, fooText: string) => console.log(fooCount, fooText));
emitter.emit('eventTwo', 2, 'second event');

emitter.emit('eventTwo', 'text', 2); // Causes typechecking error.
```

### InheritableEventEmitter
This version is convenient for quickly adding event emitter functionality to an existing class.
It publicly exposes the `on`/`off` methods but protects the `emit` method.
```ts
class MyClass extends InheritableEventEmitter<MyEvents> {}

const myClass = new MyClass();
myClass.on('eventOne', (fooCount: number) => console.log(fooCount));
```

### Utility Types
The `EventSource<T>` interface represents anything that can emit events that can be listened to. `EventEmitter` and `InheritableEventEmitter` both implement it.

`Handler<Events, EventName>` gives the type of the handler used to handle a specific event.
```ts
type EventOneHandler = Handler<MyEvents, 'eventOne'>; // (fooCount: number) => void;
```

`HandlerParams<Events, EventName>` is similar to `Handler`, but it just gives the parameters as a named tuple.
```ts
type EventOneHandler = HandlerParams<MyEvents, 'eventOne'>; // [fooCount: number]
```

### Adding event emitter functionality to a class without extending InheritableEventEmitter

```ts
class MyClass extends SomeOtherClass {
  private readonly eventEmitter = new EventEmitter<MyEvents>();

  public readonly on = eventEmitter.makeDelegate('on', this);
  public readonly off = eventEmitter.makeDelegate('off', this);
  protected readonly emit = eventEmitter.makeDelegate('emit', this);i
}
```

## License - MIT

Copyright 2022 Andrew Kolos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
