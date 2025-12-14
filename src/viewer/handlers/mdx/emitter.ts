import Emitter from '../../emitter.js';
import ParticleEmitterObject from './particleemitterobject.js';
import ParticleEmitter2Object from './particleemitter2object.js';
import RibbonEmitterObject from './ribbonemitterobject.js';
import EventObjectEmitterObject from './eventobjectemitterobject.js';
import MdxModelInstance from './modelinstance.js';

/**
 * The base of all MDX emitters.
 */
export default abstract class MdxEmitter extends Emitter {
  emitterObject: ParticleEmitterObject | ParticleEmitter2Object | RibbonEmitterObject | EventObjectEmitterObject;

  constructor(instance: MdxModelInstance, emitterObject: ParticleEmitterObject | ParticleEmitter2Object | RibbonEmitterObject | EventObjectEmitterObject) {
    super(instance);

    this.emitterObject = emitterObject;
  }

  override update(dt: number): void {
    if (this.emitterObject.ok) {
      super.update(dt);
    }
  }
}
