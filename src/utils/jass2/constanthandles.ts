import JassPlayerColor from './types/playercolor.js';
import JassRace from './types/race.js';
import JassPlayerGameResult from './types/playergameresult.js';
import JassAllianceType from './types/alliancetype.js';
import JassVersion from './types/version.js';
import JassAttackType from './types/attacktype.js';
import JassDamageType from './types/damagetype.js';
import JassWeaponType from './types/weapontype.js';
import JassPathingType from './types/pathingtype.js';
import JassMouseButtonType from './types/mousebuttontype.js';
import JassAnimType from './types/animtype.js';
import JassSubAnimType from './types/subanimtype.js';
import JassRacePreference from './types/racepreference.js';
import JassMapControl from './types/mapcontrol.js';
import JassGameType from './types/gametype.js';
import JassMapFlag from './types/mapflag.js';
import JassPlacement from './types/placement.js';
import JassStartLocPrio from './types/startlocprio.js';
import JassMapDensity from './types/mapdensity.js';
import JassGameDifficulty from './types/gamedifficulty.js';
import JassGameSpeed from './types/gamespeed.js';
import JassPlayerSlotState from './types/playerslotstate.js';
import JassVolumeGroup from './types/volumegroup.js';
import JassIGameState from './types/igamestate.js';
import JassFGameState from './types/fgamestate.js';
import JassPlayerState from './types/playerstate.js';
import JassUnitState from './types/unitstate.js';
import JassAiDifficulty from './types/aidifficulty.js';
import JassPlayerScore from './types/playerscore.js';
import JassGameEvent from './types/gameevent.js';
import JassPlayerEvent from './types/playerevent.js';
import JassPlayerUnitEvent from './types/playerunitevent.js';
import JassUnitEvent from './types/unitevent.js';
import JassWidgetEvent from './types/widgetevent.js';
import JassDialogEvent from './types/dialogevent.js';
import JassLimitOp from './types/limitop.js';
import JassUnitType from './types/unittype.js';
import JassItemType from './types/itemtype.js';
import JassCameraField from './types/camerafield.js';
import JassBlendMode from './types/blendmode.js';
import JassRarityControl from './types/raritycontrol.js';
import JassTexMapFlags from './types/texmapflags.js';
import JassFogState from './types/fogstate.js';
import JassEffectType from './types/effecttype.js';
import JassSoundType from './types/soundtype.js';
import { JassEventId, JassGameState } from './types.js';

export interface ConstantHandles {
  playerColors: JassPlayerColor[];
  races: JassRace[];
  playerGameResults: JassPlayerGameResult[];
  allianceTypes: JassAllianceType[];
  versions: JassVersion[];
  attackTypes: JassAttackType[];
  damageTypes: JassDamageType[];
  weaponTypes: JassWeaponType[];
  pathingTypes: JassPathingType[];
  mouseButtonTypes: JassMouseButtonType[];
  animTypes: JassAnimType[];
  subAnimTypes: JassSubAnimType[];
  racePrefs: JassRacePreference[];
  mapControls: JassMapControl[];
  gameTypes: JassGameType[];
  mapFlags: JassMapFlag[];
  placements: JassPlacement[];
  startLocPrios: JassStartLocPrio[];
  mapDensities: JassMapDensity[];
  gameDifficulties: JassGameDifficulty[];
  gameSpeeds: JassGameSpeed[];
  playerSlotStates: JassPlayerSlotState[];
  volumeGroups: JassVolumeGroup[];
  gameStates: JassGameState[];
  playerStates: JassPlayerState[];
  unitStates: JassUnitState[];
  aiDifficulties: JassAiDifficulty[];
  playerScores: JassPlayerScore[];
  events: JassEventId[];
  limitOps: JassLimitOp[];
  unitTypes: JassUnitType[];
  itemTypes: JassItemType[];
  cameraFields: JassCameraField[];
  blendModes: JassBlendMode[];
  rarityControls: JassRarityControl[];
  texMapFlags: JassTexMapFlags[];
  fogStates: JassFogState[];
  effectTypes: JassEffectType[];
  soundTypes: JassSoundType[];
}

export default function constantHandles(): ConstantHandles {
  const playerColors = [];
  const races = [];
  const playerGameResults = [];
  const allianceTypes = [];
  const versions = [];
  const attackTypes = [];
  const damageTypes = [];
  const weaponTypes = [];
  const pathingTypes = [];
  const mouseButtonTypes = [];
  const animTypes = [];
  const subAnimTypes = [];
  const racePrefs = [];
  const mapControls = [];
  const gameTypes = [];
  const mapFlags = [];
  const placements = [];
  const startLocPrios = [];
  const mapDensities = [];
  const gameDifficulties = [];
  const gameSpeeds = [];
  const playerSlotStates = [];
  const volumeGroups = [];
  const gameStates = [];
  const playerStates = [];
  const unitStates = [];
  const aiDifficulties = [];
  const playerScores = [];
  const events = [];
  const limitOps = [];
  const unitTypes = [];
  const itemTypes = [];
  const cameraFields = [];
  const blendModes = [];
  const rarityControls = [];
  const texMapFlags = [];
  const fogStates = [];
  const effectTypes = [];
  const soundTypes = [];

  for (let i = 0; i < 24; i++) {
    playerColors[i] = new JassPlayerColor(i);
  }

  for (let i = 0; i < 8; i++) {
    races[i] = new JassRace(i);
  }

  for (let i = 0; i < 4; i++) {
    playerGameResults[i] = new JassPlayerGameResult(i);
  }

  for (let i = 0; i < 10; i++) {
    allianceTypes[i] = new JassAllianceType(i);
  }

  for (let i = 0; i < 2; i++) {
    versions[i] = new JassVersion(i);
  }

  for (let i = 0; i < 7; i++) {
    attackTypes[i] = new JassAttackType(i);
  }

  for (let i = 0; i < 27; i++) {
    // Note: 1, 2, 3, 6, and 7 not exposed in common.j
    damageTypes[i] = new JassDamageType(i);
  }

  for (let i = 0; i < 24; i++) {
    weaponTypes[i] = new JassWeaponType(i);
  }

  for (let i = 0; i < 8; i++) {
    pathingTypes[i] = new JassPathingType(i);
  }

  for (let i = 0; i < 4; i++) {
    mouseButtonTypes[i] = new JassMouseButtonType(i);
  }

  for (let i = 0; i < 11; i++) {
    animTypes[i] = new JassAnimType(i);
  }

  for (let i = 11; i < 63; i++) {
    subAnimTypes[i] = new JassSubAnimType(i);
  }

  for (let i = 0; i < 8; i++) {
    const p = Math.pow(2, i);

    racePrefs[p] = new JassRacePreference(p);
  }

  for (let i = 0; i < 6; i++) {
    mapControls[i] = new JassMapControl(i);
  }

  for (let i = 0; i < 8; i++) {
    const p = Math.pow(2, i);

    gameTypes[p] = new JassGameType(p);
  }

  for (let i = 0; i < 20; i++) {
    const p = Math.pow(2, i);

    mapFlags[p] = new JassMapFlag(p);
  }

  for (let i = 0; i < 4; i++) {
    placements[i] = new JassPlacement(i);
  }

  for (let i = 0; i < 3; i++) {
    startLocPrios[i] = new JassStartLocPrio(i);
  }

  for (let i = 0; i < 4; i++) {
    mapDensities[i] = new JassMapDensity(i);
  }

  for (let i = 0; i < 4; i++) {
    gameDifficulties[i] = new JassGameDifficulty(i);
  }

  for (let i = 0; i < 5; i++) {
    gameSpeeds[i] = new JassGameSpeed(i);
  }

  for (let i = 0; i < 3; i++) {
    playerSlotStates[i] = new JassPlayerSlotState(i);
  }

  for (let i = 0; i < 8; i++) {
    volumeGroups[i] = new JassVolumeGroup(i);
  }

  for (let i = 0; i < 2; i++) {
    gameStates[i] = new JassIGameState(i);
  }

  for (let i = 2; i < 3; i++) {
    gameStates[i] = new JassFGameState(i);
  }

  for (let i = 0; i < 26; i++) {
    // Note: 17-24 not exposed in common.j
    playerStates[i] = new JassPlayerState(i);
  }

  for (let i = 0; i < 4; i++) {
    unitStates[i] = new JassUnitState(i);
  }

  for (let i = 0; i < 3; i++) {
    aiDifficulties[i] = new JassAiDifficulty(i);
  }

  for (let i = 0; i < 25; i++) {
    playerScores[i] = new JassPlayerScore(i);
  }

  for (let i = 0; i < 11; i++) {
    events[i] = new JassGameEvent(i);
  }

  for (let i = 11; i < 18; i++) {
    events[i] = new JassPlayerEvent(i);
  }

  for (let i = 18; i < 52; i++) {
    events[i] = new JassPlayerUnitEvent(i);
  }

  for (let i = 52; i < 89; i++) {
    events[i] = new JassUnitEvent(i);
  }

  for (let i = 89; i < 90; i++) {
    events[i] = new JassWidgetEvent(i);
  }

  for (let i = 90; i < 92; i++) {
    events[i] = new JassDialogEvent(i);
  }

  for (let i = 256; i < 260; i++) {
    events[i] = new JassGameEvent(i);
  }

  for (let i = 261; i < 269; i++) {
    events[i] = new JassPlayerEvent(i);
  }

  for (let i = 269; i < 278; i++) {
    events[i] = new JassPlayerUnitEvent(i);
  }

  for (let i = 286; i < 295; i++) {
    events[i] = new JassUnitEvent(i);
  }

  for (let i = 0; i < 6; i++) {
    limitOps[i] = new JassLimitOp(i);
  }

  for (let i = 0; i < 27; i++) {
    unitTypes[i] = new JassUnitType(i);
  }

  for (let i = 0; i < 9; i++) {
    itemTypes[i] = new JassItemType(i);
  }

  for (let i = 0; i < 7; i++) {
    cameraFields[i] = new JassCameraField(i);
  }

  for (let i = 0; i < 6; i++) {
    blendModes[i] = new JassBlendMode(i);
  }

  for (let i = 0; i < 1; i++) {
    rarityControls[i] = new JassRarityControl(i);
  }

  for (let i = 0; i < 4; i++) {
    texMapFlags[i] = new JassTexMapFlags(i);
  }

  for (let i = 0; i < 3; i++) {
    const p = Math.pow(2, i);

    fogStates[p] = new JassFogState(p);
  }

  for (let i = 0; i < 7; i++) {
    effectTypes[i] = new JassEffectType(i);
  }

  for (let i = 0; i < 2; i++) {
    soundTypes[i] = new JassSoundType(i);
  }

  return {
    playerColors,
    races,
    playerGameResults,
    allianceTypes,
    versions,
    attackTypes,
    damageTypes,
    weaponTypes,
    pathingTypes,
    mouseButtonTypes,
    animTypes,
    subAnimTypes,
    racePrefs,
    mapControls,
    gameTypes,
    mapFlags,
    placements,
    startLocPrios,
    mapDensities,
    gameDifficulties,
    gameSpeeds,
    playerSlotStates,
    volumeGroups,
    gameStates,
    playerStates,
    unitStates,
    aiDifficulties,
    playerScores,
    events,
    limitOps,
    unitTypes,
    itemTypes,
    cameraFields,
    blendModes,
    rarityControls,
    texMapFlags,
    fogStates,
    effectTypes,
    soundTypes,
  };
}
