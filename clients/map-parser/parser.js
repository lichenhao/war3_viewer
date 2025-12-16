import War3Map from '../../src/parsers/w3x/map.js';
import War3MapW3e from '../../src/parsers/w3x/w3e/file.js';
import War3MapDoo from '../../src/parsers/w3x/doo/file.js';
import War3MapUnitsDoo from '../../src/parsers/w3x/unitsdoo/file.js';
import War3MapW3c from '../../src/parsers/w3x/w3c/file.js';
import War3MapW3r from '../../src/parsers/w3x/w3r/file.js';
import War3MapW3s from '../../src/parsers/w3x/w3s/file.js';

/**
 * War3 Map Parser
 * Converts binary map files to standardized JSON representation
 */
export class War3MapParser {
  constructor() {
    this.map = new War3Map();
  }

  /**
   * Parse a map file buffer
   * @param {ArrayBuffer|Uint8Array} buffer - The map file buffer
   * @returns {Object} Parsed map data in JSON format
   */
  parse(buffer) {
    try {
      // Load the map
      this.map.load(buffer);
      
      // Parse all components
      const parsedData = {
        info: this.parseMapInfo(),
        environment: this.parseEnvironment(),
        doodads: this.parseDoodads(),
        units: this.parseUnits(),
        triggers: this.parseTriggers(),
        modifications: this.parseModifications(),
        imports: this.parseImports(),
        cameras: this.parseCameras(),
        regions: this.parseRegions(),
        sounds: this.parseSounds(),
        customTriggers: this.parseCustomTriggers(),
        stringTable: this.parseStringTable(),
        scripts: this.parseScripts()
      };
      
      return parsedData;
    } catch (error) {
      console.error('Error parsing map:', error);
      throw new Error(`Failed to parse map: ${error.message}`);
    }
  }

  /**
   * Parse map information (war3map.w3i)
   * @returns {Object|null}
   */
  parseMapInfo() {
    try {
      const info = this.map.getMapInformation();
      return {
        version: info.version,
        saves: info.saves,
        editorVersion: info.editorVersion,
        buildVersion: Array.from(info.buildVersion),
        name: info.name,
        author: info.author,
        description: info.description,
        recommendedPlayers: info.recommendedPlayers,
        cameraBounds: Array.from(info.cameraBounds),
        cameraBoundsComplements: Array.from(info.cameraBoundsComplements),
        playableSize: Array.from(info.playableSize),
        flags: info.flags,
        tileset: info.tileset,
        campaignBackground: info.campaignBackground,
        loadingScreenModel: info.loadingScreenModel,
        loadingScreenText: info.loadingScreenText,
        loadingScreenTitle: info.loadingScreenTitle,
        loadingScreenSubtitle: info.loadingScreenSubtitle,
        loadingScreen: info.loadingScreen,
        prologueScreenModel: info.prologueScreenModel,
        prologueScreenText: info.prologueScreenText,
        prologueScreenTitle: info.prologueScreenTitle,
        prologueScreenSubtitle: info.prologueScreenSubtitle,
        useTerrainFog: info.useTerrainFog,
        fogHeight: Array.from(info.fogHeight),
        fogDensity: info.fogDensity,
        fogColor: Array.from(info.fogColor),
        globalWeather: info.globalWeather,
        soundEnvironment: info.soundEnvironment,
        lightEnvironmentTileset: info.lightEnvironmentTileset,
        waterVertexColor: Array.from(info.waterVertexColor),
        scriptMode: info.scriptMode,
        graphicsMode: info.graphicsMode,
        defaultCameraZoom: info.defaultCameraZoom,
        maxCameraZoom: info.maxCameraZoom,
        minCameraZoom: info.minCameraZoom,
        players: info.players.map(player => ({
          id: player.id,
          type: player.type,
          race: player.race,
          isFixedStartPosition: player.isFixedStartPosition,
          name: player.name,
          startLocation: Array.from(player.startLocation),
          allyLowPriorities: player.allyLowPriorities,
          allyHighPriorities: player.allyHighPriorities
        })),
        forces: info.forces.map(force => ({
          flags: force.flags,
          playerMasks: force.playerMasks,
          name: force.name
        })),
        upgradeAvailabilityChanges: info.upgradeAvailabilityChanges.map(change => ({
          playerFlags: change.playerFlags,
          id: change.id,
          levelAffected: change.levelAffected,
          availability: change.availability
        })),
        techAvailabilityChanges: info.techAvailabilityChanges.map(change => ({
          playerFlags: change.playerFlags,
          id: change.id,
          availability: change.availability
        })),
        randomUnitTables: info.randomUnitTables.map(table => ({
          id: table.id,
          name: table.name,
          positions: table.positions.map(position => ({
            chance: position.chance,
            ids: [...position.ids]
          }))
        })),
        randomItemTables: info.randomItemTables.map(table => ({
          id: table.id,
          name: table.name,
          items: table.items.map(item => ({
            chance: item.chance,
            id: item.id
          }))
        }))
      };
    } catch (error) {
      console.warn('Failed to parse map info:', error);
      return null;
    }
  }

  /**
   * Parse environment data (war3map.w3e)
   * @returns {Object|null}
   */
  parseEnvironment() {
    try {
      const file = this.map.get('war3map.w3e');
      if (!file) return null;

      const parser = new War3MapW3e();
      parser.load(file.bytes());

      return {
        version: parser.version,
        tileset: parser.tileset,
        haveCustomTileset: parser.haveCustomTileset,
        groundTilesets: [...parser.groundTilesets],
        cliffTilesets: [...parser.cliffTilesets],
        mapSize: Array.from(parser.mapSize),
        centerOffset: Array.from(parser.centerOffset),
        corners: parser.corners.map(row => 
          row.map(corner => ({
            layerHeight: corner.layerHeight,
            waterLevel: corner.waterLevel,
            groundHeight: corner.groundHeight,
            waterHeight: corner.waterHeight,
            flags: corner.flags,
            texture: corner.texture,
            variation: corner.variation
          }))
        )
      };
    } catch (error) {
      console.warn('Failed to parse environment:', error);
      return null;
    }
  }

  /**
   * Parse doodads and destructibles (war3map.doo)
   * @returns {Object|null}
   */
  parseDoodads() {
    try {
      const file = this.map.get('war3map.doo');
      if (!file) return null;

      const buildVersion = this.getBuildVersion();
      const parser = new War3MapDoo();
      parser.load(file.bytes(), buildVersion);

      return {
        version: parser.version,
        doodads: parser.doodads.map(doodad => ({
          id: doodad.id,
          variation: doodad.variation,
          location: Array.from(doodad.location),
          angle: doodad.angle,
          scale: Array.from(doodad.scale),
          skinId: doodad.skinId,
          flags: doodad.flags,
          life: doodad.life,
          editorId: doodad.editorId
        })),
        terrainDoodads: parser.terrainDoodads.map(terrainDoodad => ({
          id: terrainDoodad.id,
          variation: terrainDoodad.variation,
          location: Array.from(terrainDoodad.location),
          angle: terrainDoodad.angle,
          scale: Array.from(terrainDoodad.scale),
          skinId: terrainDoodad.skinId,
          flags: terrainDoodad.flags,
          editorId: terrainDoodad.editorId
        }))
      };
    } catch (error) {
      console.warn('Failed to parse doodads:', error);
      return null;
    }
  }

  /**
   * Parse units and items (war3mapUnits.doo)
   * @returns {Object|null}
   */
  parseUnits() {
    try {
      const file = this.map.get('war3mapUnits.doo');
      if (!file) return null;

      const buildVersion = this.getBuildVersion();
      const parser = new War3MapUnitsDoo();
      parser.load(file.bytes(), buildVersion);

      return {
        version: parser.version,
        subversion: parser.subversion,
        units: parser.units.map(unit => ({
          id: unit.id,
          variation: unit.variation,
          location: Array.from(unit.location),
          angle: unit.angle,
          scale: Array.from(unit.scale),
          skinId: unit.skinId,
          flags: unit.flags,
          editorId: unit.editorId,
          life: unit.life,
          mana: unit.mana,
          droppedItemTable: unit.droppedItemTable,
          droppedItemSets: unit.droppedItemSets.map(set => ({
            items: set.items.map(item => ({
              id: item.id,
              chance: item.chance
            }))
          })),
          activeItemTable: unit.activeItemTable,
          portraitModel: unit.portraitModel,
          customTeamColor: unit.customTeamColor,
          customTeamColorId: unit.customTeamColorId,
          customSkin: unit.customSkin,
          customSkinId: unit.customSkinId,
          customRace: unit.customRace,
          customRaceId: unit.customRaceId,
          customAI: unit.customAI,
          customAIId: unit.customAIId,
          customMusic: unit.customMusic,
          customMusicId: unit.customMusicId,
          customName: unit.customName,
          customNameId: unit.customNameId,
          customDescription: unit.customDescription,
          customDescriptionId: unit.customDescriptionId,
          customHostileName: unit.customHostileName,
          customHostileNameId: unit.customHostileNameId,
          customPassiveName: unit.customPassiveName,
          customPassiveNameId: unit.customPassiveNameId,
          customHostileDescription: unit.customHostileDescription,
          customHostileDescriptionId: unit.customHostileDescriptionId,
          customPassiveDescription: unit.customPassiveDescription,
          customPassiveDescriptionId: unit.customPassiveDescriptionId,
          customPriority: unit.customPriority,
          customUpgrades: unit.customUpgrades.map(upgrade => ({
            id: upgrade.id,
            level: upgrade.level
          })),
          customAbilitySkin: unit.customAbilitySkin,
          customAbilitySkinId: unit.customAbilitySkinId,
          customHeroSkin: unit.customHeroSkin,
          customHeroSkinId: unit.customHeroSkinId,
          customBuildingSkin: unit.customBuildingSkin,
          customBuildingSkinId: unit.customBuildingSkinId,
          tintingColor: Array.from(unit.tintingColor),
          playerId: unit.playerId,
          heroLevel: unit.heroLevel,
          heroStrength: unit.heroStrength,
          heroAgility: unit.heroAgility,
          heroIntelligence: unit.heroIntelligence,
          heroSkillPoints: unit.heroSkillPoints,
          heroSkills: unit.heroSkills.map(skill => ({
            id: skill.id,
            level: skill.level
          })),
          randomFlag: unit.randomFlag,
          level: unit.level,
          itemClass: unit.itemClass,
          unitGroup: unit.unitGroup,
          positionIndex: unit.positionIndex,
          rotationIndex: unit.rotationIndex,
          waypointId: unit.waypointId,
          actionIndex: unit.actionIndex
        }))
      };
    } catch (error) {
      console.warn('Failed to parse units:', error);
      return null;
    }
  }

  /**
   * Parse triggers (war3map.wtg)
   * @returns {Object|null}
   */
  parseTriggers() {
    try {
      // For simplicity, we'll return basic info about trigger files
      const file = this.map.get('war3map.wtg');
      if (!file) return null;

      return {
        exists: true,
        size: file.bytes().byteLength
      };
    } catch (error) {
      console.warn('Failed to parse triggers:', error);
      return null;
    }
  }

  /**
   * Parse modifications (w3u, w3t, w3b, w3d, w3a, w3h, w3q)
   * @returns {Object}
   */
  parseModifications() {
    try {
      const modifications = this.map.readModifications();
      const result = {};

      // Process each modification type
      for (const [key, mod] of Object.entries(modifications)) {
        if (mod) {
          result[key] = {
            version: mod.version,
            originalTable: this.parseModificationTable(mod.originalTable),
            customTable: this.parseModificationTable(mod.customTable)
          };
        }
      }

      return result;
    } catch (error) {
      console.warn('Failed to parse modifications:', error);
      return {};
    }
  }

  /**
   * Parse a modification table
   * @param {ModificationTable} table 
   * @returns {Object}
   */
  parseModificationTable(table) {
    return {
      objects: table.objects.map(obj => ({
        id: obj.id,
        oldId: obj.oldId,
        modifications: obj.modifications.map(mod => ({
          id: mod.id,
          type: mod.type,
          level: mod.level,
          dataPointer: mod.dataPointer,
          value: mod.value
        }))
      }))
    };
  }

  /**
   * Parse imports (war3map.imp)
   * @returns {Object|null}
   */
  parseImports() {
    try {
      this.map.readImports();
      const entries = [];

      for (const [path, entry] of this.map.imports.entries) {
        entries.push({
          path: path,
          isCustom: entry.isCustom
        });
      }

      return {
        version: this.map.imports.version,
        entries: entries
      };
    } catch (error) {
      console.warn('Failed to parse imports:', error);
      return null;
    }
  }

  /**
   * Parse cameras (war3map.w3c)
   * @returns {Object|null}
   */
  parseCameras() {
    try {
      const file = this.map.get('war3map.w3c');
      if (!file) return null;

      const buildVersion = this.getBuildVersion();
      const parser = new War3MapW3c();
      parser.load(file.bytes(), buildVersion);

      return {
        version: parser.version,
        cameras: parser.cameras.map(camera => ({
          target: Array.from(camera.target),
          offset: Array.from(camera.offset),
          rotation: camera.rotation,
          angleOfAttack: camera.angleOfAttack,
          distance: camera.distance,
          roll: camera.roll,
          fov: camera.fov,
          farClipping: camera.farClipping,
          name: camera.name
        }))
      };
    } catch (error) {
      console.warn('Failed to parse cameras:', error);
      return null;
    }
  }

  /**
   * Parse regions (war3map.w3r)
   * @returns {Object|null}
   */
  parseRegions() {
    try {
      const file = this.map.get('war3map.w3r');
      if (!file) return null;

      const parser = new War3MapW3r();
      parser.load(file.bytes());

      return {
        version: parser.version,
        regions: parser.regions.map(region => ({
          left: region.left,
          right: region.right,
          bottom: region.bottom,
          top: region.top,
          name: region.name,
          creationNumber: region.creationNumber,
          color: Array.from(region.color)
        }))
      };
    } catch (error) {
      console.warn('Failed to parse regions:', error);
      return null;
    }
  }

  /**
   * Parse sounds (war3map.w3s)
   * @returns {Object|null}
   */
  parseSounds() {
    try {
      const file = this.map.get('war3map.w3s');
      if (!file) return null;

      const parser = new War3MapW3s();
      parser.load(file.bytes());

      return {
        version: parser.version,
        sounds: parser.sounds.map(sound => ({
          name: sound.name,
          file: sound.file,
          eaxEffect: sound.eaxEffect,
          flags: sound.flags,
          fadeInRate: sound.fadeInRate,
          fadeOutRate: sound.fadeOutRate,
          volume: sound.volume,
          pitch: sound.pitch,
          pitchVariance: sound.pitchVariance,
          priority: sound.priority,
          channel: sound.channel,
          minDistance: sound.minDistance,
          maxDistance: sound.maxDistance,
          distanceCutoff: sound.distanceCutoff,
          coneInside: sound.coneInside,
          coneOutside: sound.coneOutside,
          coneOutsideVolume: sound.coneOutsideVolume,
          coneOrientation: Array.from(sound.coneOrientation),
          position: Array.from(sound.position),
          orientation: Array.from(sound.orientation),
          loopingFadeInRate: sound.loopingFadeInRate,
          loopingFadeOutRate: sound.loopingFadeOutRate,
          occlusionDirect: sound.occlusionDirect,
          occlusionReverb: sound.occlusionReverb,
          indoorOutdoor: sound.indoorOutdoor,
          soundName: sound.soundName,
          elevation: sound.elevation,
          spread: sound.spread
        }))
      };
    } catch (error) {
      console.warn('Failed to parse sounds:', error);
      return null;
    }
  }

  /**
   * Parse custom triggers (war3map.wct)
   * @returns {Object|null}
   */
  parseCustomTriggers() {
    try {
      const customTriggers = this.map.readCustomTextTriggers();
      if (!customTriggers) return null;

      return {
        version: customTriggers.version,
        comment: customTriggers.comment,
        triggers: customTriggers.triggers.map(trigger => ({
          name: trigger.name,
          isEnabled: trigger.isEnabled,
          isCustomText: trigger.isCustomText,
          script: trigger.script
        }))
      };
    } catch (error) {
      console.warn('Failed to parse custom triggers:', error);
      return null;
    }
  }

  /**
   * Parse string table (war3map.wts)
   * @returns {Object|null}
   */
  parseStringTable() {
    try {
      const stringTable = this.map.readStringTable();
      if (!stringTable) return null;

      const stringMap = {};
      for (const [key, value] of stringTable.stringMap) {
        stringMap[key] = value;
      }

      return {
        strings: stringMap
      };
    } catch (error) {
      console.warn('Failed to parse string table:', error.message || 'Unknown error');
      return null;
    }
  }

  /**
   * Get map build version
   * @returns {number}
   */
  getBuildVersion() {
    try {
      const info = this.map.getMapInformation();
      return info.getBuildVersion();
    } catch (_error) {
      return 0;
    }
  }

  /**
   * Parse script files (war3map.j, war3map.lua)
   * @returns {Object|null}
   */
  parseScripts() {
    try {
      const scripts = {};
      
      // Try to get JASS script
      const jassFile = this.map.get('war3map.j') || this.map.get('scripts\\war3map.j');
      if (jassFile) {
        scripts.jass = jassFile.text();
      }
      
      // Try to get Lua script
      const luaFile = this.map.get('war3map.lua') || this.map.get('scripts\\war3map.lua');
      if (luaFile) {
        scripts.lua = luaFile.text();
      }
      
      // Try to get common.j
      const commonJFile = this.map.get('Scripts\\common.j');
      if (commonJFile) {
        scripts.commonJ = commonJFile.text();
      }
      
      // Try to get blizzard.j
      const blizzardJFile = this.map.get('Scripts\\blizzard.j');
      if (blizzardJFile) {
        scripts.blizzardJ = blizzardJFile.text();
      }
      
      return Object.keys(scripts).length > 0 ? scripts : null;
    } catch (error) {
      console.warn('Failed to parse scripts:', error);
      return null;
    }
  }
}
