import EventObjectEmitter from './eventobjectemitter.js';
import EventObjectSnd from './eventobjectsnd.js';

/**
 * An MDX sound emitter.
 */
export default class EventObjectSndEmitter extends EventObjectEmitter {
  createObject(): EventObjectSnd {
    return new EventObjectSnd(this);
  }
}
