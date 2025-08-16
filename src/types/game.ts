export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  rotation: number;
  isActive: boolean;
}

export interface Player extends GameObject {
  health: number;
  maxHealth: number;
  fireRate: number;
  lastShotTime: number;
  powerUps: PowerUpType[];
}

export interface Enemy extends GameObject {
  health: number;
  speed: number;
  points: number;
  type: EnemyType;
  lastShotTime?: number;
}

export interface Bullet extends GameObject {
  damage: number;
  isPlayerBullet: boolean;
  color: string;
}

export interface PowerUp extends GameObject {
  type: PowerUpType;
  duration: number;
}

export interface Particle {
  position: Vector2D;
  velocity: Vector2D;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  level: number;
  lives: number;
}

export enum EnemyType {
  ASTEROID = 'asteroid',
  SCOUT = 'scout',
  HEAVY = 'heavy',
  BOSS = 'boss'
}

export enum PowerUpType {
  RAPID_FIRE = 'rapidFire',
  SHIELD = 'shield',
  MULTI_SHOT = 'multiShot',
  HEALTH = 'health'
}

export enum GameEvent {
  PLAYER_HIT = 'playerHit',
  ENEMY_DESTROYED = 'enemyDestroyed',
  POWER_UP_COLLECTED = 'powerUpCollected',
  LEVEL_UP = 'levelUp',
  GAME_OVER = 'gameOver'
}

export interface GameConfig {
  canvas: {
    width: number;
    height: number;
  };
  player: {
    speed: number;
    fireRate: number;
    maxHealth: number;
  };
  enemies: {
    spawnRate: number;
    maxOnScreen: number;
    speedMultiplier: number;
  };
  physics: {
    friction: number;
    gravity: number;
  };
}