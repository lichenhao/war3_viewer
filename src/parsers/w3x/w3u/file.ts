import BinaryStream from "../../../common/binarystream.js";
import ModificationTable from "./modificationtable.js";

/**
 * war3map.w3u - the unit modification file.
 *
 * Also used for war3map.w3t (items), war3map.w3b (destructibles), and war3map.w3h (buffs).
 */
export default class War3MapW3u {
  version = 0;
  originalTable = new ModificationTable();
  customTable = new ModificationTable();

  load(bufferOrStream: ArrayBuffer | Uint8Array | BinaryStream): void {
    let stream;

    if (bufferOrStream instanceof BinaryStream) {
      stream = bufferOrStream;
    } else {
      stream = new BinaryStream(bufferOrStream);
    }

    this.version = stream.readInt32();
    this.originalTable.load(stream, false, this.version);
    this.customTable.load(stream, false, this.version);
  }

  save(): Uint8Array {
    const stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));

    stream.writeInt32(this.version);
    this.originalTable.save(stream, false, this.version);
    this.customTable.save(stream, false, this.version);

    return stream.uint8array;
  }

  getByteLength(): number {
    return (
      4 +
      this.originalTable.getByteLength(false, this.version) +
      this.customTable.getByteLength(false, this.version)
    );
  }
}
