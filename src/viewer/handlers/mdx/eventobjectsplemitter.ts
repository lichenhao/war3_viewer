import EventObjectEmitter from './eventobjectemitter.js';
import EventObjectSplUbr from './eventobjectsplubr.js';

/**
 * An MDX splat emitter.
 */
export default class EventObjectSplEmitter extends EventObjectEmitter {
  createObject(): EventObjectSplUbr {
    return new EventObjectSplUbr(this);
  }
}
