import JassAgent from './agent.js';

/**
 * type trigger
 */
export default class JassTrigger extends JassAgent {
  events: number[] = [];
  conditions: number[] = [];
  actions: number[] = [];
  enabled = true;
}
