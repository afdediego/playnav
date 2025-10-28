/**
 * Formation controller - manages enemy group movement
 */

import { Enemy } from './Enemy';
import type {
  FormationState,
  FormationDirection,
  EnemyType,
  Rectangle,
  LevelConfig,
} from '../engine/types';
import { GAME_CONFIG } from '../engine/types';

export class Formation {
  private enemies: Enemy[] = [];
  private direction: FormationDirection = 'right';
  private speed: number;
  private shouldDrop: boolean = false;
  private readonly canvasWidth: number;
  private readonly dropDistance: number = GAME_CONFIG.FORMATION_DROP_DISTANCE;

  constructor(canvasWidth: number, level: number = 1) {
    this.canvasWidth = canvasWidth;
    this.speed = this.calculateSpeed(level);
    this.createFormation(level);
  }

  /**
   * Create enemy formation based on level
   */
  private createFormation(level: number): void {
    const config = this.getLevelConfig(level);
    
    // Posición inicial varía según el nivel
    const startX = 30 + ((level - 1) * 20) % 100; // Cambia posición horizontal
    const startY = GAME_CONFIG.ENEMY_START_Y + ((level - 1) * 10) % 40; // Cambia altura inicial

    let enemyIndex = 0;

    for (let row = 0; row < config.enemyRows; row++) {
      // Tipos de enemigos varían según nivel
      let type: EnemyType;
      if (level <= 2) {
        // Niveles 1-2: distribución normal
        if (row === 0) {
          type = 'squid';
        } else if (row <= 2) {
          type = 'crab';
        } else {
          type = 'octopus';
        }
      } else if (level === 3) {
        // Nivel 3: más crabs
        if (row <= 1) {
          type = 'crab';
        } else if (row === 2) {
          type = 'squid';
        } else {
          type = 'octopus';
        }
      } else if (level === 4) {
        // Nivel 4: más squids
        if (row <= 2) {
          type = 'squid';
        } else {
          type = 'crab';
        }
      } else {
        // Nivel 5: formación mixta
        type = row % 2 === 0 ? 'squid' : 'crab';
      }

      for (let col = 0; col < config.enemyCols; col++) {
        const x = startX + col * GAME_CONFIG.ENEMY_SPACING_X;
        const y = startY + row * GAME_CONFIG.ENEMY_SPACING_Y;

        const enemy = new Enemy({ x, y }, type, row, col);
        this.enemies.push(enemy);
        enemyIndex++;
      }
    }
  }

  /**
   * Get level configuration - Dificultad EXTREMA x15 TOTAL
   */
  private getLevelConfig(level: number): LevelConfig {
    // AUMENTADO: Más disparos en todos los niveles (+50%)
    const shootMultipliers = [
      4.5,    // Nivel 1: 4.5x base - Más disparos desde el inicio
      7.5,    // Nivel 2: 7.5x base - Bastante intenso
      11.0,   // Nivel 3: 11x base - Muy desafiante
      15.0,   // Nivel 4: 15x base - Extremadamente difícil
      22.0    // Nivel 5: 22x base - LLUVIA DE BALAS
    ];
    
    const shootMultiplier = shootMultipliers[level - 1] || shootMultipliers[4];
    
    return {
      level,
      enemySpeed: this.calculateSpeed(level),
      enemyShootProbability: GAME_CONFIG.BASE_SHOOT_PROBABILITY * shootMultiplier,
      enemyRows: Math.min(5, 3 + Math.floor((level - 1) / 2)),
      enemyCols: Math.min(9, 6 + Math.floor((level - 1) / 2)),
      pointsMultiplier: 1 + (level - 1) * 0.2,
    };
  }

  /**
   * Calculate formation speed based on level - VELOCIDAD LATERAL AUMENTADA
   */
  private calculateSpeed(level: number): number {
    // Velocidad lateral MUCHO más rápida para movimiento dinámico
    const speedMultipliers = [
      3.5,   // Nivel 1: 3.5x - Movimiento rápido desde el inicio
      5.0,   // Nivel 2: 5x - Muy rápido lateralmente
      7.0,   // Nivel 3: 7x - Súper rápido
      9.5,   // Nivel 4: 9.5x - Extremadamente rápido
      12.0   // Nivel 5: 12x - VELOCIDAD LATERAL MÁXIMA
    ];
    
    return GAME_CONFIG.BASE_ENEMY_SPEED * (speedMultipliers[level - 1] || speedMultipliers[4]);
  }

  /**
   * Update formation
   */
  public update(deltaTime: number): void {
    // Update all enemies
    this.enemies.forEach(enemy => enemy.update(deltaTime));

    // Remove inactive enemies
    this.enemies = this.enemies.filter(enemy => enemy.active);

    if (this.enemies.length === 0) return;

    // Calculate formation bounds
    const bounds = this.getBounds();

    // Check if formation should change direction
    if (this.direction === 'right' && bounds.x + bounds.width >= this.canvasWidth - 10) {
      this.direction = 'left';
      this.shouldDrop = true;
    } else if (this.direction === 'left' && bounds.x <= 10) {
      this.direction = 'right';
      this.shouldDrop = true;
    }

    // Move formation
    const moveX = this.speed * deltaTime * (this.direction === 'right' ? 1 : -1);
    const moveY = this.shouldDrop ? this.dropDistance : 0;

    this.enemies.forEach(enemy => {
      enemy.position.x += moveX;
      enemy.position.y += moveY;
    });

    if (this.shouldDrop) {
      this.shouldDrop = false;
      // Increase speed slightly after each drop
      this.speed *= 1.05;
    }
  }

  /**
   * Draw all enemies
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    this.enemies.forEach(enemy => enemy.draw(ctx));
  }

  /**
   * Get formation bounds
   */
  public getBounds(): Rectangle {
    if (this.enemies.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    this.enemies.forEach(enemy => {
      const bounds = enemy.getBounds();
      minX = Math.min(minX, bounds.x);
      minY = Math.min(minY, bounds.y);
      maxX = Math.max(maxX, bounds.x + bounds.width);
      maxY = Math.max(maxY, bounds.y + bounds.height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Get all active enemies
   */
  public getEnemies(): Enemy[] {
    return this.enemies.filter(enemy => enemy.active);
  }

  /**
   * Get random enemy that can shoot
   */
  public getRandomShootingEnemy(): Enemy | null {
    const activeEnemies = this.getEnemies();
    if (activeEnemies.length === 0) return null;

    // Prefer enemies in the front (bottom rows)
    const frontEnemies = this.getFrontEnemies();
    const shooters = frontEnemies.length > 0 ? frontEnemies : activeEnemies;

    return shooters[Math.floor(Math.random() * shooters.length)];
  }

  /**
   * Get enemies in the front line (one per column)
   */
  private getFrontEnemies(): Enemy[] {
    const columns = new Map<number, Enemy>();

    this.enemies.forEach(enemy => {
      if (!enemy.active) return;

      const current = columns.get(enemy.col);
      if (!current || enemy.position.y > current.position.y) {
        columns.set(enemy.col, enemy);
      }
    });

    return Array.from(columns.values());
  }

  /**
   * Check if any enemy reached the bottom
   */
  public hasReachedBottom(canvasHeight: number): boolean {
    return this.enemies.some(
      enemy => enemy.active && enemy.position.y + enemy.height >= canvasHeight - 30
    );
  }

  /**
   * Check if formation is cleared
   */
  public isCleared(): boolean {
    return this.enemies.length === 0;
  }

  /**
   * Get formation state
   */
  public getState(): FormationState {
    return {
      enemies: this.enemies,
      direction: this.direction,
      speed: this.speed,
      dropDistance: this.dropDistance,
      shouldDrop: this.shouldDrop,
      bounds: this.getBounds(),
    };
  }
}


