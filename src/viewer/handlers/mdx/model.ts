
import Parser from '../../../parsers/mdlx/model.js';
import Sequence from './sequence.js';
import { HandlerResourceData } from '../../handlerresource.js';
import Model from '../../model.js';
import Texture from '../../texture.js';
import mdxHandler from './handler.js';
import TextureAnimation from './textureanimation.js';
import Layer from './layer.js';
import Material from './material.js';
import GeosetAnimation from './geosetanimation.js';
import replaceableIds from './replaceableids.js';
import Bone from './bone.js';
import Light from './light.js';
import Helper from './helper.js';
import Attachment from './attachment.js';
import ParticleEmitterObject from './particleemitterobject.js';
import ParticleEmitter2Object from './particleemitter2object.js';
import RibbonEmitterObject from './ribbonemitterobject.js';
import Camera from './camera.js';
import EventObjectEmitterObject from './eventobjectemitterobject.js';
import CollisionShape from './collisionshape.js';
import setupGeosets from './setupgeosets.js';
import setupGroups from './setupgroups.js';
import BatchGroup from './batchgroup.js';
import EmitterGroup from './emittergroup.js';
import GenericObject from './genericobject.js';
import { Batch } from './batch.js';
import Geoset from './geoset.js';
import MdxModelInstance from './modelinstance.js';
import MdxTexture from './texture.js';

/**
 * An MDX model.
 */
export default class MdxModel extends Model {
  reforged = false;
  hd = false;
  solverParams: { reforged?: boolean, hd?: boolean } = {};
  name = '';
  sequences: Sequence[] = [];
  globalSequences: number[] = [];
  materials: Material[] = [];
  layers: Layer[] = [];
  textures: MdxTexture[] = [];
  textureAnimations: TextureAnimation[] = [];
  geosets: Geoset[] = [];
  geosetAnimations: GeosetAnimation[] = [];
  bones: Bone[] = [];
  lights: Light[] = [];
  helpers: Helper[] = [];
  attachments: Attachment[] = [];
  pivotPoints: Float32Array[] = [];
  particleEmitters: ParticleEmitterObject[] = [];
  particleEmitters2: ParticleEmitter2Object[] = [];
  ribbonEmitters: RibbonEmitterObject[] = [];
  cameras: Camera[] = [];
  eventObjects: EventObjectEmitterObject[] = [];
  collisionShapes: CollisionShape[] = [];
  hasLayerAnims = false;
  hasGeosetAnims = false;
  batches: Batch[] = [];
  genericObjects: GenericObject[] = [];
  sortedGenericObjects: GenericObject[] = [];
  hierarchy: number[] = [];
  opaqueGroups: BatchGroup[] = [];
  translucentGroups: (BatchGroup | EmitterGroup)[] = [];
  arrayBuffer: WebGLBuffer | null = null;
  elementBuffer: WebGLBuffer | null = null;
  skinDataType = 0;
  bytesPerSkinElement = 1;

  constructor(bufferOrParser: ArrayBuffer | string | Parser, resourceData: HandlerResourceData) {
    super(resourceData);

    let parser;

    if (bufferOrParser instanceof Parser) {
      parser = bufferOrParser;
    } else {
      parser = new Parser();

      try {
        parser.load(bufferOrParser);
      } catch (e) {
        // If we get here, the parser failed to load.
        // It still may have loaded enough data to support rendering though!
        // I have encountered a model that is missing data, but still works in-game.
        // So just let the code continue.
        // If the handler manages to load the model, nothing happened.
        // If critical data is missing, it will fail and throw its own exception.
      }
    }

    const viewer = this.viewer;
    const pathSolver = this.pathSolver;
    const solverParams = this.solverParams;
    const reforged = parser.version > 800;
    const texturesExt = reforged ? '.dds' : '.blp';
    let hasTeamColors = false;

    this.reforged = reforged;
    this.name = parser.name;

    // Initialize the bounds.
    const extent = parser.extent;
    this.bounds.fromExtents(extent.min, extent.max);

    // Sequences
    for (const sequence of parser.sequences) {
      this.sequences.push(new Sequence(sequence));
    }

    // Global sequences
    for (const globalSequence of parser.globalSequences) {
      this.globalSequences.push(globalSequence);
    }

    // Texture animations
    for (const textureAnimation of parser.textureAnimations) {
      this.textureAnimations.push(new TextureAnimation(this, textureAnimation));
    }

    // Materials
    let layerId = 0;
    for (const material of parser.materials) {
      const layers = [];

      for (const layer of material.layers) {
        const vLayer = new Layer(this, layer, layerId++, material.priorityPlane);

        layers.push(vLayer);

        this.layers.push(vLayer);
      }

      this.materials.push(new Material(this, material.shader, layers));

      if (material.shader !== '') {
        this.hd = true;
      }
    }

    if (reforged) {
      solverParams.reforged = true;
    }

    if (this.hd) {
      solverParams.hd = true;

      // mdxHandler.loadEnv(viewer);
    }

    // Textures.
    const textures = parser.textures;
    for (let i = 0, l = textures.length; i < l; i++) {
      const texture = textures[i];
      let path = texture.path;
      const replaceableId = texture.replaceableId;
      const wrapMode = texture.wrapMode;

      if (path === '' && replaceableId !== 0) {
        path = `ReplaceableTextures\\${replaceableIds[replaceableId]}${texturesExt}`;

        if (replaceableId === 1 || replaceableId === 2) {
          hasTeamColors = true;
        }
      }

      const mdxTexture = new MdxTexture(replaceableId, wrapMode);

      viewer.load(path, pathSolver, solverParams)
        .then((texture) => {
          if (texture) {
            mdxTexture.texture = <Texture>texture;
          }
        });

      this.textures[i] = mdxTexture;
    }

    // Geoset animations
    for (const geosetAnimation of parser.geosetAnimations) {
      this.geosetAnimations.push(new GeosetAnimation(this, geosetAnimation));
    }

    this.pivotPoints = parser.pivotPoints;

    // Tracks the IDs of all generic objects.
    let objectId = 0;

    // Bones
    for (const bone of parser.bones) {
      this.bones.push(new Bone(this, bone, objectId++));
    }

    // Lights
    for (const light of parser.lights) {
      this.lights.push(new Light(this, light, objectId++));
    }

    // Helpers
    for (const helper of parser.helpers) {
      this.helpers.push(new Helper(this, helper, objectId++));
    }

    // Attachments
    for (const attachment of parser.attachments) {
      this.attachments.push(new Attachment(this, attachment, objectId++));
    }

    // Particle emitters
    for (const particleEmitter of parser.particleEmitters) {
      this.particleEmitters.push(new ParticleEmitterObject(this, particleEmitter, objectId++));
    }

    // Particle emitters 2
    for (const particleEmitter2 of parser.particleEmitters2) {
      const emitter = new ParticleEmitter2Object(this, particleEmitter2, objectId++);

      this.particleEmitters2.push(emitter);

      if (emitter.teamColored) {
        hasTeamColors = true;
      }
    }

    // Ribbon emitters
    for (const ribbonEmitter of parser.ribbonEmitters) {
      this.ribbonEmitters.push(new RibbonEmitterObject(this, ribbonEmitter, objectId++));
    }

    // Cameras
    for (const camera of parser.cameras) {
      this.cameras.push(new Camera(this, camera));
    }

    // Event objects
    for (const eventObject of parser.eventObjects) {
      this.eventObjects.push(new EventObjectEmitterObject(this, eventObject, objectId++));
    }

    // Collision shapes
    for (const collisionShape of parser.collisionShapes) {
      this.collisionShapes.push(new CollisionShape(this, collisionShape, objectId++));
    }

    // One array for all generic objects.
    this.genericObjects.push(...this.bones, ...this.lights, ...this.helpers, ...this.attachments, ...this.particleEmitters, ...this.particleEmitters2, ...this.ribbonEmitters, ...this.eventObjects, ...this.collisionShapes);

    // Geosets
    setupGeosets(this, parser.geosets);

    // Render groups.
    setupGroups(this);

    // Creates the sorted indices array of the generic objects.
    this.setupHierarchy(-1);

    // Keep a sorted array.
    for (let i = 0, l = this.genericObjects.length; i < l; i++) {
      this.sortedGenericObjects[i] = this.genericObjects[this.hierarchy[i]];
    }

    // Lazy loading team colors.
    if (hasTeamColors) {
      mdxHandler.loadTeamTextures(viewer);
    }
  }

  addInstance(): MdxModelInstance {
    return new MdxModelInstance(this);
  }

  setupHierarchy(parent: number): void {
    for (let i = 0, l = this.genericObjects.length; i < l; i++) {
      const object = this.genericObjects[i];

      if (object.parentId === parent) {
        this.hierarchy.push(i);

        this.setupHierarchy(object.objectId);
      }
    }
  }
}
