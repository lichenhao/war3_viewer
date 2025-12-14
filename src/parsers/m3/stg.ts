import BinaryStream from '../../common/binarystream.js';
import IndexEntry from './indexentry.js';
import Reference from './reference.js';

/**
 * An animation getter.
 */
export default class Stg {
  version = -1;
  name = new Reference();
  stcIndices = new Reference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
    this.version = version;
    this.name.load(stream, index);
    this.stcIndices.load(stream, index);
  }
}
