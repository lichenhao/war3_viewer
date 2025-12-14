import { DdsImage } from '../../../parsers/dds/image.js';
import isDds from '../../../parsers/dds/isformat.js';
import ModelViewer from '../../viewer.js';
import Texture from './texture.js';

export default {
  load(viewer: ModelViewer): void {
    const webgl = viewer.webgl;

    // Optionally used when decoding mipmaps.
    if (!webgl.ensureExtension('WEBGL_compressed_texture_s3tc')) {
      console.warn('DDS: No compressed textures support! This might reduce performance.');
    }
  },
  isValidSource(object: unknown): boolean {
    if (object instanceof DdsImage) {
      return true;
    }

    return isDds(object);
  },
  resource: Texture,
};
