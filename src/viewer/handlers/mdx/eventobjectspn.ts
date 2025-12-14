import Scene from '../../scene.js';
import EmittedObject from '../../emittedobject.js';
import MdxModel from './model.js';
import EventObjectEmitterObject from './eventobjectemitterobject.js';
import MdxModelInstance from './modelinstance.js';
import EventObjectSpnEmitter from './eventobjectspnemitter.js';

/**
 * An MDX spawned model object.
 */
export default class EventObjectSpn extends EmittedObject {
  internalInstance: MdxModelInstance;

  constructor(emitter: EventObjectSpnEmitter) {
    super(emitter);

    const emitterObject = <EventObjectEmitterObject>emitter.emitterObject;
    const internalModel = <MdxModel>emitterObject.internalModel;

    this.internalInstance = internalModel.addInstance();
  }

  bind(): void {
    const emitter = <EventObjectSpnEmitter>this.emitter;
    const instance = <MdxModelInstance>emitter.instance;
    const scene = <Scene>instance.scene;
    const node = instance.nodes[emitter.emitterObject.index];
    const internalInstance = this.internalInstance;

    internalInstance.setScene(scene);
    internalInstance.setSequence(0);
    internalInstance.setTransformation(node.worldLocation, node.worldRotation, node.worldScale);
    internalInstance.show();

    this.health = 1;
  }

  update(_dt: number): void{
    const instance = this.internalInstance;
    const model = <MdxModel>instance.model;

    // Once the sequence finishes, this event object dies
    if (instance.frame >= model.sequences[0].interval[1]) {
      this.health = 0;

      instance.hide();
    }
  }
}
