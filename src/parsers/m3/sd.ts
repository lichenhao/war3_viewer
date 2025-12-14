import BinaryStream from '../../common/binarystream.js';
import IndexEntry from './indexentry.js';
import Reference from './reference.js';

/**
 * Sequence data.
 */
export default class Sd {
  version = -1;
  keys = new Reference();
  flags = 0;
  biggestKey = -1;
  values = new Reference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
    this.version = version;
    this.keys.load(stream, index);
    this.flags = stream.readUint32();
    this.biggestKey = stream.readUint32();
    this.values.load(stream, index);
  }
}
