import BinaryStream from '../../common/binarystream.js';
import TokenStream from './tokenstream.js';
import AnimatedObject from './animatedobject.js';

/**
 * A texture animation.
 */
export default class TextureAnimation extends AnimatedObject {
  readMdx(stream: BinaryStream): void {
    const size = stream.readUint32();

    this.readAnimations(stream, size - 4);
  }

  writeMdx(stream: BinaryStream): void {
    stream.writeUint32(this.getByteLength());
    this.writeAnimations(stream);
  }

  readMdl(stream: TokenStream): void {
    for (const token of stream.readBlock()) {
      if (token === 'Translation') {
        this.readAnimation(stream, 'KTAT');
      } else if (token === 'Rotation') {
        this.readAnimation(stream, 'KTAR');
      } else if (token === 'Scaling') {
        this.readAnimation(stream, 'KTAS');
      } else {
        throw new Error(`Unknown token in TextureAnimation: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream): void {
    stream.startBlock('TVertexAnim ');
    this.writeAnimation(stream, 'KTAT');
    this.writeAnimation(stream, 'KTAR');
    this.writeAnimation(stream, 'KTAS');
    stream.endBlock();
  }

  override getByteLength(): number {
    return 4 + super.getByteLength();
  }
}
