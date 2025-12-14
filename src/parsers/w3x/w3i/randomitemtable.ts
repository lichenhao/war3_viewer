import BinaryStream from '../../../common/binarystream.js';
import { byteLengthUtf8 } from '../../../common/utf8.js';
import RandomItemSet from './randomitemset.js';

/**
 * A random item table.
 */
export default class RandomItemTable {
  id = 0;
  name = '';
  sets: RandomItemSet[] = [];

  load(stream: BinaryStream): void {
    this.id = stream.readInt32();
    this.name = stream.readNull();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      const set = new RandomItemSet();

      set.load(stream);

      this.sets[i] = set;
    }
  }

  save(stream: BinaryStream): void {
    stream.writeInt32(this.id);
    stream.writeNull(this.name);
    stream.writeUint32(this.sets.length);

    for (const set of this.sets) {
      set.save(stream);
    }
  }

  getByteLength(): number {
    let size = 9 + byteLengthUtf8(this.name);

    for (const set of this.sets) {
      size += set.getByteLength();
    }

    return size;
  }
}
