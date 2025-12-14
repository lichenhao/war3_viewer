import JassAgent from './agent.js';
import JassUnit from './unit.js';

/**
 * type group
 */
export default class JassGroup extends JassAgent {
  units: Set<JassUnit> = new Set();
}
