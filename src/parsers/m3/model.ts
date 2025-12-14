import BinaryStream from '../../common/binarystream.js';
import IndexEntry from './indexentry.js';
import Md34 from './md34.js';
import ModelHeader from './modelheader.js';

/**
 * A model.
 */
export default class Model {
  index: IndexEntry[] = [];
  model: ModelHeader | null = null;

  load(src: ArrayBuffer | Uint8Array): void {
    const stream = new BinaryStream(src);
    const header = new Md34();

    header.load(stream, 11, this.index);

    if (header.tag !== 'MD34') {
      throw new Error('WrongMagicNumber');
    }

    stream.seek(header.offset);

    // Read the index entries
    for (let i = 0, l = header.entries; i < l; i++) {
      this.index[i] = new IndexEntry(stream, this.index);
    }

    const modelEntries = this.index[header.model.id].entries;

    if (modelEntries) {
      this.model = <ModelHeader>modelEntries[0];
    }
  }
}
