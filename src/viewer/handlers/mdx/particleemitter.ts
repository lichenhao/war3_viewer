import ParticleEmitterObject from './particleemitterobject.js';
import MdxModelInstance from './modelinstance.js';
import MdxEmitter from './emitter.js';
import Particle from './particle.js';

const emissionRateHeap = new Float32Array(1);

/**
 * An MDX particle emitter.
 */
export default class ParticleEmitter extends MdxEmitter {
  updateEmission(dt: number): void {
    const instance = <MdxModelInstance>this.instance;

    if (instance.allowParticleSpawn) {
      const emitterObject = <ParticleEmitterObject>this.emitterObject;

      emitterObject.getEmissionRate(emissionRateHeap, instance.sequence, instance.frame, instance.counter);

      this.currentEmission += emissionRateHeap[0] * dt;
    }
  }

  emit(): void {
    this.emitObject();
  }

  createObject(): Particle {
    return new Particle(this);
  }
}
