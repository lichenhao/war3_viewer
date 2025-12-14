import JassAgent from './agent.js';
import JassRect from './rect.js';

/**
 * type region
 */
export default class JassRegion extends JassAgent {
  rects: Set<JassRect> = new Set();
}
