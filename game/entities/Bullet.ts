/**
 * Bullet entity - projectiles fired by player and enemies
 */

import type { BulletEntity, BulletOwner, Vector2, Rectangle } from '../engine/types';
import { GAME_CONFIG } from '../engine/types';

export class Bullet implements BulletEntity {
  public id: string;
  public position: Vector2;
  public velocity: Vector2;
  public width: number;
  public height: number;
  public active: boolean = true;
  public owner: BulletOwner;
  public damage: number = 1;

  private readonly canvasWidth: number;
  private readonly canvasHeight: number;

  constructor(
    position: Vector2,
    owner: BulletOwner,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.id = `bullet_${owner}_${Date.now()}_${Math.random()}`;
    this.position = { ...position };
    this.owner = owner;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.width = GAME_CONFIG.BULLET_WIDTH;
    this.height = GAME_CONFIG.BULLET_HEIGHT;

    // Set velocity based on owner
    const speed = GAME_CONFIG.BULLET_SPEED;
    this.velocity = {
      x: 0,
      y: owner === 'player' ? -speed : speed,
    };
  }

  /**
   * Update bullet position
   */
  public update(deltaTime: number): void {
    if (!this.active) return;

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Deactivate if out of bounds
    if (
      this.position.y < -this.height ||
      this.position.y > this.canvasHeight ||
      this.position.x < -this.width ||
      this.position.x > this.canvasWidth
    ) {
      this.active = false;
    }
  }

  /**
   * Draw bullet
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();

    const x = Math.floor(this.position.x);
    const y = Math.floor(this.position.y);

    if (this.owner === 'player') {
      // Player bullet - bright green with glow
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(x, y, this.width, this.height);
      
      // Glow effect
      ctx.fillStyle = '#88ff88';
      ctx.fillRect(x - 1, y, 1, this.height);
      ctx.fillRect(x + this.width, y, 1, this.height);
    } else {
      // Enemy bullet - bright red/orange with glow effect más visible
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(x, y, this.width, this.height);
      
      // Strong glow effect
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(x - 1, y, 1, this.height);
      ctx.fillRect(x + this.width, y, 1, this.height);
      
      // Top highlight
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(x, y, this.width, 2);
    }

    ctx.restore();
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
   * Deactivate bullet
   */
  public destroy(): void {
    this.active = false;
  }
}


