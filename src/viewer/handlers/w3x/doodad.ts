import { vec3, quat } from 'gl-matrix';
import { VEC3_UNIT_Z } from '../../../common/gl-matrix-addon.js';
import { MappedDataRow } from '../../../utils/mappeddata.js';
import DooDoodad from '../../../parsers/w3x/doo/doodad.js';
import MdxModel from '../mdx/model.js';
import War3MapViewerMap from './map.js';
import { Widget } from './widget.js';

/**
 * A doodad.
 */
export default class Doodad extends Widget {
  row: MappedDataRow;

  constructor(map: War3MapViewerMap, model: MdxModel, row: MappedDataRow, doodad: DooDoodad) {
    super(map, model);

    const instance = this.instance;

    instance.move(<vec3>doodad.location);
    instance.rotateLocal(quat.setAxisAngle(quat.create(), VEC3_UNIT_Z, doodad.angle));
    instance.scale(<vec3>doodad.scale);
    instance.setScene(map.worldScene);

    this.instance = instance;
    this.row = row;
  }
}
