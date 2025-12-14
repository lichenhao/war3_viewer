import MdxModel from './model.js';
import Layer from './layer.js';

/**
 * An MDX material.
 */
export default class Material {
  model: MdxModel;
  shader: string;
  layers: Layer[];

  constructor(model: MdxModel, shader: string, layers: Layer[]) {
    this.model = model;
    this.shader = shader;
    this.layers = layers;
  }
}
