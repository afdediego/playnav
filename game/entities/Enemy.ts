/**
 * Enemy entity - invaders that move in formation
 */

import type { EnemyEntity, EnemyType, Vector2, Rectangle } from '../engine/types';
import { GAME_CONFIG } from '../engine/types';

export class Enemy implements EnemyEntity {
  public id: string;
  public position: Vector2;
  public velocity: Vector2;
  public width: number;
  public height: number;
  public active: boolean = true;
  public type: EnemyType;
  public points: number;
  public row: number;
  public col: number;
  public canShoot: boolean = true;
  public animFrame: number = 0;

  private animTimer: number = 0;
  private readonly animSpeed: number = 0.5; // seconds per frame

  constructor(
    position: Vector2,
    type: EnemyType,
    row: number,
    col: number
  ) {
    this.id = `enemy_${row}_${col}`;
    this.position = { ...position };
    this.type = type;
    this.row = row;
    this.col = col;
    this.width = GAME_CONFIG.ENEMY_WIDTH;
    this.height = GAME_CONFIG.ENEMY_HEIGHT;
    this.velocity = { x: 0, y: 0 };

    // Set points based on type
    switch (type) {
      case 'squid':
        this.points = 30;
        break;
      case 'crab':
        this.points = 20;
        break;
      case 'octopus':
        this.points = 10;
        break;
    }
  }

  /**
   * Update enemy state
   */
  public update(deltaTime: number): void {
    if (!this.active) return;

    // Update animation
    this.animTimer += deltaTime;
    if (this.animTimer >= this.animSpeed) {
      this.animFrame = (this.animFrame + 1) % 2;
      this.animTimer = 0;
    }

    // Position is updated by formation controller
  }

  /**
   * Draw enemy
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();

    const x = Math.floor(this.position.x);
    const y = Math.floor(this.position.y);

    // Set color based on type
    let color: string;
    switch (this.type) {
      case 'squid':
        color = '#ffff00'; // Yellow
        break;
      case 'crab':
        color = '#ff00ff'; // Magenta
        break;
      case 'octopus':
        color = '#00ffff'; // Cyan
        break;
    }

    ctx.fillStyle = color;

    // Draw enemy shape (varies by type and animation frame)
    this.drawEnemyShape(ctx, x, y, this.animFrame);

    ctx.restore();
  }

  /**
   * Draw enemy shape based on type
   */
  private drawEnemyShape(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    frame: number
  ): void {
    const offset = frame === 0 ? 0 : 1;

    switch (this.type) {
      case 'squid':
        this.drawSquid(ctx, x, y, offset);
        break;
      case 'crab':
        this.drawCrab(ctx, x, y, offset);
        break;
      case 'octopus':
        this.drawOctopus(ctx, x, y, offset);
        break;
    }
  }

  private drawSquid(ctx: CanvasRenderingContext2D, x: number, y: number, offset: number): void {
    // ESCALA 10X - Naves 4x más grandes necesitan pixel art más grande
    const scale = 10;
    const offsetScaled = offset * scale;
    
    // Top row
    ctx.fillRect(x + 2*scale, y, 2*scale, 1*scale);
    ctx.fillRect(x + 7*scale, y, 2*scale, 1*scale);
    
    // Second row
    ctx.fillRect(x + 1*scale, y + 1*scale, 1*scale, 1*scale);
    ctx.fillRect(x + 3*scale, y + 1*scale, 1*scale, 1*scale);
    ctx.fillRect(x + 7*scale, y + 1*scale, 1*scale, 1*scale);
    ctx.fillRect(x + 9*scale, y + 1*scale, 1*scale, 1*scale);
    
    // Middle rows (body)
    ctx.fillRect(x + 1*scale, y + 2*scale, 9*scale, 2*scale);
    
    // Bottom rows (tentacles - animated)
    ctx.fillRect(x + offsetScaled, y + 4*scale, 2*scale, 1*scale);
    ctx.fillRect(x + 4*scale, y + 4*scale, 3*scale, 1*scale);
    ctx.fillRect(x + 9*scale - offsetScaled, y + 4*scale, 2*scale, 1*scale);
    
    ctx.fillRect(x + offsetScaled, y + 5*scale, 1*scale, 2*scale);
    ctx.fillRect(x + 5*scale, y + 5*scale, 1*scale, 2*scale);
    ctx.fillRect(x + 10*scale - offsetScaled, y + 5*scale, 1*scale, 2*scale);
  }

  private drawCrab(ctx: CanvasRenderingContext2D, x: number, y: number, offset: number): void {
    // ESCALA 10X - Naves 4x más grandes necesitan pixel art más grande
    const scale = 10;
    const offsetScaled = offset * scale;
    
    // Claws (top)
    ctx.fillRect(x + offsetScaled, y, 1*scale, 1*scale);
    ctx.fillRect(x + 10*scale - offsetScaled, y, 1*scale, 1*scale);
    
    // Body
    ctx.fillRect(x + 1*scale, y + 1*scale, 9*scale, 1*scale);
    ctx.fillRect(x + 0*scale, y + 2*scale, 11*scale, 2*scale);
    
    // Middle detail
    ctx.fillRect(x + 2*scale, y + 4*scale, 2*scale, 1*scale);
    ctx.fillRect(x + 4*scale, y + 4*scale, 3*scale, 1*scale);
    ctx.fillRect(x + 7*scale, y + 4*scale, 2*scale, 1*scale);
    
    // Legs (animated)
    ctx.fillRect(x + 1*scale + offsetScaled, y + 5*scale, 2*scale, 2*scale);
    ctx.fillRect(x + 8*scale - offsetScaled, y + 5*scale, 2*scale, 2*scale);
  }

  private drawOctopus(ctx: CanvasRenderingContext2D, x: number, y: number, offset: number): void {
    // ESCALA 10X - Naves 4x más grandes necesitan pixel art más grande
    const scale = 10;
    const offsetScaled = offset * scale;
    
    // Head
    ctx.fillRect(x + 3*scale, y, 5*scale, 1*scale);
    ctx.fillRect(x + 2*scale, y + 1*scale, 7*scale, 2*scale);
    
    // Eyes
    const currentFillStyle = ctx.fillStyle;
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 3*scale, y + 2*scale, 2*scale, 1*scale);
    ctx.fillRect(x + 6*scale, y + 2*scale, 2*scale, 1*scale);
    
    // Body
    ctx.fillStyle = currentFillStyle;
    ctx.fillRect(x + 2*scale, y + 3*scale, 7*scale, 1*scale);
    
    // Tentacles (animated)
    ctx.fillRect(x + 1*scale + offsetScaled, y + 4*scale, 2*scale, 2*scale);
    ctx.fillRect(x + 4*scale, y + 4*scale, 3*scale, 2*scale);
    ctx.fillRect(x + 8*scale - offsetScaled, y + 4*scale, 2*scale, 2*scale);
  }

  /**
   * Get collision bounds
   */
  public getBounds(): Rectangle {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Destroy enemy
   */
  public destroy(): void {
    this.active = false;
  }

  /**
   * Get bullet spawn position
   */
  public getBulletSpawnPosition(): Vector2 {
    return {
      x: this.position.x + this.width / 2 - GAME_CONFIG.BULLET_WIDTH / 2,
      y: this.position.y + this.height,
    };
  }
}


