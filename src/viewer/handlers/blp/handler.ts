import { BlpImage } from '../../../parsers/blp/image.js';
import isBlp from '../../../parsers/blp/isformat.js';
import Texture from './texture.js';

export default {
  isValidSource(object: unknown): boolean {
    if (object instanceof BlpImage) {
      return true;
    }

    return isBlp(object);
  },
  resource: Texture,
};
