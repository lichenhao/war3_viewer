import BinaryStream from "../../../common/binarystream.js";
import Modification from "./modification.js";

/**
 * A modified object.
 */
export default class ModifiedObject {
  oldId = "\0\0\0\0";
  newId = "\0\0\0\0";
  sets = 1;
  setsFlag: number[] = [];
  modifications: Modification[] = [];

  load(
    stream: BinaryStream,
    useOptionalInts: boolean,
    formatVersion: number
  ): void {
    this.oldId = stream.readBinary(4);
    this.newId = stream.readBinary(4);

    if (formatVersion >= 3) {
      this.sets = stream.readUint32();
    }

    for (let set = 0; set < this.sets; set++) {
      if (formatVersion >= 3) {
        this.setsFlag[set] = stream.readUint32();
      }

      for (let i = 0, l = stream.readUint32(); i < l; i++) {
        const modification = new Modification();

        modification.load(stream, useOptionalInts);

        this.modifications[i] = modification;
      }
    }
  }

  save(
    stream: BinaryStream,
    useOptionalInts: boolean,
    formatVersion: number
  ): void {
    if (this.oldId !== "\0\0\0\0") {
      stream.writeBinary(this.oldId);
    } else {
      stream.writeUint32(0);
    }

    if (this.newId !== "\0\0\0\0") {
      stream.writeBinary(this.newId);
    } else {
      stream.writeUint32(0);
    }

    if (formatVersion >= 3) {
      stream.writeUint32(this.sets);
    }

    stream.writeUint32(this.modifications.length);

    for (let set = 0; set < this.sets; set++) {
      if (formatVersion >= 3) {
        stream.writeUint32(this.setsFlag[set]);
      }
      for (const modification of this.modifications) {
        modification.save(stream, useOptionalInts);
      }
    }
  }

  getByteLength(useOptionalInts: boolean, formatVersion: number): number {
    let size = formatVersion >= 3 ? 16 : 12;

    for (let set = 0; set < this.sets; set++) {
      if (formatVersion >= 3) {
        size += 4;
      }
      for (const modification of this.modifications) {
        size += modification.getByteLength(useOptionalInts);
      }
    }

    return size;
  }
}
