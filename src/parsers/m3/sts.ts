import BinaryStream from '../../common/binarystream.js';
import IndexEntry from './indexentry.js';
import Reference from './reference.js';

/**
 * An animation validator.
 */
export default class Sts {
  version = -1;
  animIds = new Reference();

  load(reader: BinaryStream, version: number, index: IndexEntry[]): void {
    this.version = version;
    this.animIds.load(reader, index);

    reader.skip(16); // ?
  }
}
