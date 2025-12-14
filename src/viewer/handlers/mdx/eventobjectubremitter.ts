import EventObjectEmitter from './eventobjectemitter.js';
import EventObjectSplUbr from './eventobjectsplubr.js';

/**
 * An MDX ubersplat emitter.
 */
export default class EventObjectUbrEmitter extends EventObjectEmitter {
  createObject(): EventObjectSplUbr {
    return new EventObjectSplUbr(this);
  }
}
