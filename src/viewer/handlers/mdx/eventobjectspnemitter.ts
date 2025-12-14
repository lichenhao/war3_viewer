import EventObjectEmitter from './eventobjectemitter.js';
import EventObjectSpn from './eventobjectspn.js';

/**
 * An MDX model emitter.
 */
export default class EventObjectSpnEmitter extends EventObjectEmitter {
  createObject(): EventObjectSpn {
    return new EventObjectSpn(this);
  }
}
