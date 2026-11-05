export type GameGenre =
  | 'obby'
  | 'tycoon'
  | 'survival'
  | 'simulator'
  | 'arena'
  | 'horror'
  | 'racing'
  | 'adventure';

export type PartType = 'Part' | 'SpawnLocation' | 'WedgePart' | 'Cylinder' | 'TrussPart';
export type PartShape = 'Block' | 'Ball' | 'Cylinder';
export type PartMaterial =
  | 'Plastic'
  | 'SmoothPlastic'
  | 'Neon'
  | 'Wood'
  | 'WoodPlanks'
  | 'Grass'
  | 'Metal'
  | 'Glass'
  | 'Cobblestone'
  | 'Brick'
  | 'DiamondPlate';

export type PartTag =
  | 'baseplate'
  | 'spawn'
  | 'checkpoint'
  | 'lava'
  | 'coin'
  | 'speed_pad'
  | 'jump_pad'
  | 'door'
  | 'wall'
  | 'finish'
  | 'dropper'
  | 'conveyor'
  | 'collector'
  | 'buy_button'
  | 'spawner'
  | 'crate'
  | 'turret'
  | 'prop';

export interface RobloxPart {
  id: string;
  name: string;
  type: PartType;
  shape?: PartShape;
  size: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string; // Hex color e.g. "#FF4444"
  brickColorName?: string; // e.g. "Really red"
  material: PartMaterial;
  transparency: number;
  anchored: boolean;
  canCollide: boolean;
  tag?: PartTag;
  checkpointNumber?: number;
  coinValue?: number;
  price?: number;
  itemReward?: string;
  tooltip?: string;
}

export interface RobloxLighting {
  clockTime: number; // 0 to 24 (e.g. 14.5 for afternoon, 0 for midnight)
  brightness: number;
  ambient: string;
  outdoorAmbient: string;
  fogEnd: number;
  fogColor: string;
  technology: 'ShadowMap' | 'Future' | 'Voxel';
  exposureCompensation: number;
  sunRays: boolean;
  bloom: boolean;
  colorCorrection: {
    brightness: number;
    contrast: number;
    saturation: number;
    tintColor: string;
  };
}

export interface RobloxGameplaySettings {
  walkSpeed: number; // default 16
  jumpPower: number; // default 50
  maxHealth: number; // default 100
  respawnTime: number; // default 3
  cameraMode: 'Classic' | 'Follow' | 'LockFirstPerson';
  gravity: number; // default 196.2
  currencyName: string; // e.g. "Coins", "Cash", "Gems"
  objective: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
}

export interface LuauScript {
  id: string;
  name: string;
  path: string; // e.g. "ServerScriptService/GameManager"
  target: 'ServerScriptService' | 'StarterPlayerScripts' | 'StarterCharacterScripts' | 'ReplicatedStorage' | 'StarterGui';
  type: 'Script' | 'LocalScript' | 'ModuleScript';
  description: string;
  code: string;
}

export interface RobloxGame {
  id: string;
  prompt: string;
  title: string;
  description: string;
  genre: GameGenre;
  version: string;
  author: string;
  createdAt: string;
  gameplay: RobloxGameplaySettings;
  lighting: RobloxLighting;
  parts: RobloxPart[];
  scripts: LuauScript[];
  stats: {
    totalParts: number;
    totalStagesOrZones: number;
    estimatedPlayTimeMinutes: number;
    recommendedPlayers: string;
  };
  features: string[];
}
