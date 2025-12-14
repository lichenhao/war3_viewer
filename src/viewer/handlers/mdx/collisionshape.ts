import MdlxCollisionShape, { Shape } from '../../../parsers/mdlx/collisionshape.js';
import GenericObject from './genericobject.js';
import MdxModel from './model.js';

/**
 * A collision shape.
 */
export default class CollisionShape extends GenericObject {
  type: Shape;
  vertices: Float32Array[];
  boundsRadius: number;

  constructor(model: MdxModel, collisionShape: MdlxCollisionShape, index: number) {
    super(model, collisionShape, index);

    this.type = collisionShape.type;
    this.vertices = collisionShape.vertices;
    this.boundsRadius = collisionShape.boundsRadius;
  }
}
