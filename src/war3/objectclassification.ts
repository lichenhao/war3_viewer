/**
 * War3地图物体分类系统
 */

// 物体大类枚举
export enum ObjectTypeCategory {
  Terrain = 'Terrain',           // 地表类
  Doodad = 'Doodad',             // 装饰类
  Building = 'Building',         // 建筑类
  Player = 'Player',             // 玩家类
  NormalUnit = 'NormalUnit',     // 普通单位类
  EliteUnit = 'EliteUnit'        // 精英怪类
}

// 阵营枚举
export enum Faction {
  Human = 'Human',               // 人族（联盟）
  NightElf = 'NightElf',         // 暗夜精灵（联盟）
  Orc = 'Orc',                   // 兽人（部落）
  Undead = 'Undead',             // 不死族（部落）
  NeutralPassive = 'NeutralPassive', // 中立被动
  NeutralHostile = 'NeutralHostile', // 中立敌对
  NeutralSpecial = 'NeutralSpecial'  // 中立特殊
}

// 物体分类信息接口
export interface ObjectClassification {
  categoryId: ObjectTypeCategory;
  categoryName: string;
  faction?: Faction;
  factionName?: string;
  fileIdPrefix: string;
  storageFile: string;
  hasFaction: boolean;
}

// 物体分类数据
export const OBJECT_CLASSIFICATIONS: ObjectClassification[] = [
  {
    categoryId: ObjectTypeCategory.Terrain,
    categoryName: '地表类',
    fileIdPrefix: 'CL/BL',
    storageFile: 'war3map.w3e',
    hasFaction: false
  },
  {
    categoryId: ObjectTypeCategory.Doodad,
    categoryName: '装饰类',
    fileIdPrefix: 'Doodad/',
    storageFile: 'war3map.doo',
    hasFaction: false
  },
  {
    categoryId: ObjectTypeCategory.Building,
    categoryName: '建筑类',
    fileIdPrefix: 'H/E/O/U/N',
    storageFile: 'war3map.units',
    hasFaction: true
  },
  {
    categoryId: ObjectTypeCategory.Player,
    categoryName: '玩家类',
    fileIdPrefix: 'Player',
    storageFile: 'war3map.w3p',
    hasFaction: false
  },
  {
    categoryId: ObjectTypeCategory.NormalUnit,
    categoryName: '普通单位类',
    fileIdPrefix: 'H/E/O/U/N',
    storageFile: 'war3map.units',
    hasFaction: true
  },
  {
    categoryId: ObjectTypeCategory.EliteUnit,
    categoryName: '精英怪类',
    fileIdPrefix: 'N',
    storageFile: 'war3map.units',
    hasFaction: true
  }
];

// 阵营数据
export const FACTIONS: { faction: Faction; factionName: string; idPrefix: string }[] = [
  {
    faction: Faction.Human,
    factionName: '人族（联盟）',
    idPrefix: 'H'
  },
  {
    faction: Faction.NightElf,
    factionName: '暗夜精灵（联盟）',
    idPrefix: 'E'
  },
  {
    faction: Faction.Orc,
    factionName: '兽人（部落）',
    idPrefix: 'O'
  },
  {
    faction: Faction.Undead,
    factionName: '不死族（部落）',
    idPrefix: 'U'
  },
  {
    faction: Faction.NeutralPassive,
    factionName: '中立被动',
    idPrefix: 'N'
  },
  {
    faction: Faction.NeutralHostile,
    factionName: '中立敌对',
    idPrefix: 'N'
  },
  {
    faction: Faction.NeutralSpecial,
    factionName: '中立特殊',
    idPrefix: 'N'
  }
];

// 物体类型接口
export interface MapObject {
  id: string;
  name: string;
  categoryId: ObjectTypeCategory;
  faction?: Faction;
  position: [number, number, number];
  visible: boolean;
}
