import JassAgent from './agent.js';
import JassPlayer from './player.js';

/**
 * type force
 */
export default class JassForce extends JassAgent {
  players: Set<JassPlayer> = new Set();
}
