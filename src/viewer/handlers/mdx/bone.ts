import MdlxBone from '../../../parsers/mdlx/bone.js';
import MdxModel from './model.js';
import GenericObject from './genericobject.js';
import GeosetAnimation from './geosetanimation.js';

/**
 * An MDX bone.
 */
export default class Bone extends GenericObject {
  geosetAnimation: GeosetAnimation;

  constructor(model: MdxModel, bone: MdlxBone, index: number) {
    super(model, bone, index);

    this.geosetAnimation = model.geosetAnimations[bone.geosetAnimationId];
  }

  override getVisibility(out: Float32Array, sequence: number, frame: number, counter: number): number {
    if (this.geosetAnimation) {
      return this.geosetAnimation.getAlpha(out, sequence, frame, counter);
    }

    out[0] = 1;

    return -1;
  }
}
