import MdxModel from '../mdx/model.js';
import MdxModelInstance from '../mdx/modelinstance.js';
import War3MapViewerMap from './map.js';
import randomStandSequence from './standsequence.js';

export enum WidgetState {
  IDLE,
  WALK,
}

/**
 * A widget.
 */
export class Widget {
  instance: MdxModelInstance;
  state = WidgetState.IDLE;

  constructor(map: War3MapViewerMap, model: MdxModel) {
    this.instance = model.addInstance();

    this.instance.setScene(map.worldScene);
  }

  update(): void {
    if (this.instance.sequenceEnded || this.instance.sequence === -1) {
      if (this.state === WidgetState.IDLE) {
        randomStandSequence(this.instance);
      }
    }
  }
}
