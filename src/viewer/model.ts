import { HandlerResource } from './handlerresource.js';
import Bounds from './bounds.js';
import ModelInstance from './modelinstance.js';

/**
 * A model.
 */
export default abstract class Model extends HandlerResource {
  bounds = new Bounds();

  /**
   * Create a new instance and return it.
   */
  abstract addInstance(): ModelInstance;
}
