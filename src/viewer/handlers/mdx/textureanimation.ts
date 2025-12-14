import { VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT } from '../../../common/gl-matrix-addon.js';
import MdlxTextureAnimation from '../../../parsers/mdlx/textureanimation.js';
import AnimatedObject from './animatedobject.js';
import MdxModel from './model.js';

/**
 * An MDX texture animation.
 */
export default class TextureAnimation extends AnimatedObject {
  constructor(model: MdxModel, textureAnimation: MdlxTextureAnimation) {
    super(model, textureAnimation);

    this.addVariants('KTAT', 'translation');
    this.addVariants('KTAR', 'rotation');
    this.addVariants('KTAS', 'scale');
  }

  getTranslation(out: Float32Array, sequence: number, frame: number, counter: number): number {
    return this.getVectorValue(out, 'KTAT', sequence, frame, counter, <Float32Array>VEC3_ZERO);
  }

  getRotation(out: Float32Array, sequence: number, frame: number, counter: number): number {
    return this.getQuatValue(out, 'KTAR', sequence, frame, counter, <Float32Array>QUAT_DEFAULT);
  }

  getScale(out: Float32Array, sequence: number, frame: number, counter: number): number {
    return this.getVectorValue(out, 'KTAS', sequence, frame, counter, <Float32Array>VEC3_ONE);
  }
}
