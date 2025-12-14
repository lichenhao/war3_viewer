import TgaImage from '../../../parsers/tga/image.js';
import isTga from '../../../parsers/tga/isformat.js';
import Texture from './texture.js';

export default {
  isValidSource(object: unknown): boolean {
    if (object instanceof TgaImage) {
      return true;
    }

    return isTga(object);
  },
  resource: Texture,
};
