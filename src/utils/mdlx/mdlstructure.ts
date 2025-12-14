import Attachment from '../../parsers/mdlx/attachment.js';
import Bone from '../../parsers/mdlx/bone.js';
import Camera from '../../parsers/mdlx/camera.js';
import CollisionShape from '../../parsers/mdlx/collisionshape.js';
import FaceEffect from '../../parsers/mdlx/faceeffect.js';
import Geoset from '../../parsers/mdlx/geoset.js';
import GeosetAnimation from '../../parsers/mdlx/geosetanimation.js';
import Helper from '../../parsers/mdlx/helper.js';
import Layer from '../../parsers/mdlx/layer.js';
import Light from '../../parsers/mdlx/light.js';
import Model from '../../parsers/mdlx/model.js';
import ParticleEmitter from '../../parsers/mdlx/particleemitter.js';
import ParticleEmitter2 from '../../parsers/mdlx/particleemitter2.js';
import ParticleEmitterPopcorn from '../../parsers/mdlx/particleemitterpopcorn.js';
import RibbonEmitter from '../../parsers/mdlx/ribbonemitter.js';
import Sequence from '../../parsers/mdlx/sequence.js';
import Texture from '../../parsers/mdlx/texture.js';
import TextureAnimation from '../../parsers/mdlx/textureanimation.js';
import TokenStream from '../../parsers/mdlx/tokenstream.js';
import { getObjectName, getObjectTypeName } from './sanitytest/utils.js';

interface MdlStructureNode {
  name: string;
  source: string;
  nodes?: MdlStructureNode[];
}

function mdlObjects(stream: TokenStream, model: Model, objects: (Sequence | Layer | Texture | TextureAnimation | Geoset | GeosetAnimation | Bone | Light | Helper | Attachment | ParticleEmitter | ParticleEmitter2 | ParticleEmitterPopcorn | RibbonEmitter | Camera | CollisionShape | FaceEffect)[], out: MdlStructureNode[]): void {
  if (objects.length) {
    for (const [index, object] of objects.entries()) {
      object.writeMdl(stream, model.version);
      out.push({ name: getObjectName(object, index), source: stream.buffer });
      stream.clear();
    }
  }
}

function mdlObjectsBlock(stream: TokenStream, model: Model, objects: (Sequence | Texture | TextureAnimation)[], out: MdlStructureNode[]): void {
  if (objects.length) {
    const name = getObjectTypeName(objects[0]) + 's';
    const nodes = <MdlStructureNode[]>[];

    mdlObjects(stream, model, objects, nodes);

    model.saveStaticObjectsBlock(stream, name, objects);
    out.push({ name, source: stream.buffer, nodes });
    stream.clear();
  }
}

export default function mdlStructure(model: Model): MdlStructureNode[] {
  const stream = new TokenStream();
  const out = <MdlStructureNode[]>[];

  model.saveVersionBlock(stream);
  out.push({ name: 'Version', source: stream.buffer });
  stream.clear();

  model.saveModelBlock(stream);
  out.push({ name: 'Model', source: stream.buffer });
  stream.clear();

  mdlObjectsBlock(stream, model, model.sequences, out);

  if (model.globalSequences.length) {
    model.saveGlobalSequenceBlock(stream);
    out.push({ name: 'GlobalSequences', source: stream.buffer });
    stream.clear();
  }

  mdlObjectsBlock(stream, model, model.textures, out);

  if (model.materials.length) {
    const nodes = [];

    for (const [index, material] of model.materials.entries()) {
      const layerNodes = <MdlStructureNode[]>[];

      mdlObjects(stream, model, material.layers, layerNodes);

      material.writeMdl(stream, model.version);
      nodes.push({ name: `Material ${index}`, source: stream.buffer, nodes: layerNodes });
      stream.clear();
    }

    model.saveStaticObjectsBlock(stream, 'Materials', model.materials);
    out.push({ name: 'Materials', source: stream.buffer, nodes });
    stream.clear();
  }

  mdlObjectsBlock(stream, model, model.textureAnimations, out);
  mdlObjects(stream, model, model.geosets, out);
  mdlObjects(stream, model, model.geosetAnimations, out);
  mdlObjects(stream, model, model.bones, out);
  mdlObjects(stream, model, model.lights, out);
  mdlObjects(stream, model, model.helpers, out);
  mdlObjects(stream, model, model.attachments, out);

  if (model.pivotPoints.length) {
    model.savePivotPointBlock(stream);
    out.push({ name: 'PivotPoints', source: stream.buffer });
    stream.clear();
  }

  mdlObjects(stream, model, model.particleEmitters, out);
  mdlObjects(stream, model, model.particleEmitters2, out);
  mdlObjects(stream, model, model.particleEmittersPopcorn, out);
  mdlObjects(stream, model, model.ribbonEmitters, out);
  mdlObjects(stream, model, model.cameras, out);
  mdlObjects(stream, model, model.eventObjects, out);
  mdlObjects(stream, model, model.collisionShapes, out);
  mdlObjects(stream, model, model.faceEffects, out);

  if (model.bindPose.length) {
    model.saveBindPoseBlock(stream);
    out.push({ name: 'BindPose', source: stream.buffer });
    stream.clear();
  }

  return out;
}
