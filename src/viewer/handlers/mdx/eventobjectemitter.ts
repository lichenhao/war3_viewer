import MdxModelInstance from './modelinstance.js';
import MdxEmitter from './emitter.js';
import EventObjectEmitterObject from './eventobjectemitterobject.js';

const valueHeap = new Uint32Array(1);

/**
 * The abstract base MDX event object emitter.
 */
export default abstract class EventObjectEmitter extends MdxEmitter {
  lastValue = 0;

  updateEmission(_dt: number): void {
    const instance = <MdxModelInstance>this.instance;

    if (instance.allowParticleSpawn) {
      const emitterObject = <EventObjectEmitterObject>this.emitterObject;

      emitterObject.getValue(valueHeap, instance);

      const value = valueHeap[0];

      if (value === 1 && value !== this.lastValue) {
        this.currentEmission += 1;
      }

      this.lastValue = value;
    }
  }

  emit(): void {
    this.emitObject();
  }
}
