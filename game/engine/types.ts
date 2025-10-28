/**
 * Core game types and interfaces
 */

/** 2D Vector for positions and velocities */
export interface Vector2 {
  x: number;
  y: number;
}

/** Rectangular collision box (AABB) */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Base entity interface */
export interface Entity {
  id: string;
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  active: boolean;
  update(deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  getBounds(): Rectangle;
}

/** Player-specific properties */
export interface PlayerEntity extends Entity {
  lives: number;
  canShoot: boolean;
  shootCooldown: number;
  invulnerable: boolean;
  invulnerableTime: number;
}

/** Enemy types for different rows */
export type EnemyType = 'squid' | 'crab' | 'octopus';

/** Enemy-specific properties */
export interface EnemyEntity extends Entity {
  type: EnemyType;
  points: number;
  row: number;
  col: number;
  canShoot: boolean;
  animFrame: number;
}

/** Bullet owner types */
export type BulletOwner = 'player' | 'enemy';

/** Bullet-specific properties */
export interface BulletEntity extends Entity {
  owner: BulletOwner;
  damage: number;
}

/** Formation movement direction */
export type FormationDirection = 'left' | 'right';

/** Formation state */
export interface FormationState {
  enemies: EnemyEntity[];
  direction: FormationDirection;
  speed: number;
  dropDistance: number;
  shouldDrop: boolean;
  bounds: Rectangle;
}

/** Game states */
export type GameState =
  | 'menu'
  | 'playing'
  | 'paused'
  | 'levelComplete'
  | 'gameOver';

/** Main game state */
export interface Game {
  state: GameState;
  player: any; // Player class instance
  enemies: any[]; // Enemy class instances
  playerBullets: any[]; // Bullet class instances
  enemyBullets: any[]; // Bullet class instances
  formation: any; // Formation class instance
  score: number;
  highScore: number;
  level: number;
  lives: number;
  canvas: {
    width: number;
    height: number;
  };
  settings: {
    muted: boolean;
  };
}

/** Input state */
export interface InputState {
  left: boolean;
  right: boolean;
  shoot: boolean;
  pause: boolean;
  mute: boolean;
}

/** Level configuration */
export interface LevelConfig {
  level: number;
  enemySpeed: number;
  enemyShootProbability: number;
  enemyRows: number;
  enemyCols: number;
  pointsMultiplier: number;
}

/** Audio effect types */
export type SoundEffect = 'shoot' | 'explosion' | 'levelUp' | 'gameOver' | 'hit';

/** Particle effect */
export interface Particle {
  position: Vector2;
  velocity: Vector2;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

/** Explosion effect */
export interface Explosion {
  position: Vector2;
  particles: Particle[];
  active: boolean;
}

/** Storage keys */
export const STORAGE_KEYS = {
  HIGH_SCORE: 'playnav_high_score',
  MUTED: 'playnav_muted',
  MAX_LEVEL: 'playnav_max_level',
} as const;

/** Game constants */
export const GAME_CONFIG = {
  CANVAS_WIDTH: 1600,  // Canvas GIGANTE para naves 4x más grandes
  CANVAS_HEIGHT: 1000, // Canvas GIGANTE para naves 4x más grandes
  PLAYER_SPEED: 400,   // Más rápido proporcionalmente
  PLAYER_WIDTH: 60,    // Avión militar más grande
  PLAYER_HEIGHT: 50,   // Avión militar más grande
  PLAYER_SHOOT_COOLDOWN: 0.3,
  BULLET_SPEED: 600,   // Más rápido para el canvas más grande
  BULLET_WIDTH: 20,    // Balas 4X MÁS GRANDES (5 → 20)
  BULLET_HEIGHT: 60,   // Balas 4X MÁS GRANDES (15 → 60)
  ENEMY_WIDTH: 140,    // Enemigos 4X MÁS GRANDES (35 → 140)
  ENEMY_HEIGHT: 100,   // Enemigos 4X MÁS GRANDES (25 → 100)
  ENEMY_SPACING_X: 160, // Espaciado proporcional al tamaño
  ENEMY_SPACING_Y: 120, // Espaciado proporcional al tamaño
  ENEMY_START_Y: 120,
  FORMATION_DROP_DISTANCE: 30,
  BASE_ENEMY_SPEED: 40, // AUMENTADO: Velocidad lateral MUCHO más rápida (15 → 40)
  BASE_SHOOT_PROBABILITY: 0.15, // AUMENTADO: Más disparos para mayor desafío (0.08 → 0.15)
  INVULNERABLE_TIME: 2,
  TARGET_FPS: 60,
  MAX_LEVEL: 7, // AMPLIADO: Ahora son 7 niveles en total
  AUTO_SHOOT_MOBILE: true,
} as const;


