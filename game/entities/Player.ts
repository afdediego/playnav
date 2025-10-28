/**
 * Player entity - controlled by the user
 */

import type { PlayerEntity, Vector2, Rectangle } from '../engine/types';
import { GAME_CONFIG } from '../engine/types';
import { clamp } from '../engine/collisions';

export class Player implements PlayerEntity {
  public id: string = 'player';
  public position: Vector2;
  public velocity: Vector2;
  public width: number;
  public height: number;
  public active: boolean = true;
  public lives: number;
  public canShoot: boolean = true;
  public shootCooldown: number = 0;
  public invulnerable: boolean = false;
  public invulnerableTime: number = 0;

  private readonly canvasWidth: number;
  private readonly canvasHeight: number;
  private blinkTimer: number = 0;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    lives: number = 3
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.width = GAME_CONFIG.PLAYER_WIDTH;
    this.height = GAME_CONFIG.PLAYER_HEIGHT;
    this.lives = lives;

    // Start at bottom center
    this.position = {
      x: canvasWidth / 2 - this.width / 2,
      y: canvasHeight - this.height - 10,
    };

    this.velocity = { x: 0, y: 0 };
  }

  /**
   * Update player state
   */
  public update(deltaTime: number): void {
    if (!this.active) return;

    // Update position
    this.position.x += this.velocity.x * deltaTime;

    // Clamp to canvas bounds
    this.position.x = clamp(this.position.x, 0, this.canvasWidth - this.width);

    // Update shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
      if (this.shootCooldown <= 0) {
        this.canShoot = true;
      }
    }

    // Update invulnerability
    if (this.invulnerable) {
      this.invulnerableTime -= deltaTime;
      this.blinkTimer += deltaTime;
      if (this.invulnerableTime <= 0) {
        this.invulnerable = false;
        this.blinkTimer = 0;
      }
    }
  }

  /**
   * Draw player - Avión caza estilo F-16
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    // Blink effect when invulnerable
    if (this.invulnerable && Math.floor(this.blinkTimer * 10) % 2 === 0) {
      return;
    }

    ctx.save();

    const x = Math.floor(this.position.x);
    const y = Math.floor(this.position.y);
    const centerX = x + this.width / 2;
    const w = this.width;
    const h = this.height;

    // AVIÓN MILITAR GRIS - Estilo F-16/Caza del Ejército
    
    // Nariz puntiaguda (morro del avión)
    ctx.fillStyle = '#909090'; // Gris medio
    ctx.beginPath();
    ctx.moveTo(centerX, y); // Punta superior
    ctx.lineTo(centerX - 5, y + 8); // Izquierda
    ctx.lineTo(centerX + 5, y + 8); // Derecha
    ctx.closePath();
    ctx.fill();

    // Fuselaje principal (cuerpo central)
    ctx.fillStyle = '#808080'; // Gris oscuro
    ctx.fillRect(centerX - 6, y + 8, 12, h - 16);
    
    // Detalles del fuselaje (paneles)
    ctx.fillStyle = '#707070';
    ctx.fillRect(centerX - 5, y + 12, 10, 3);
    ctx.fillRect(centerX - 5, y + 20, 10, 3);

    // Cabina (cockpit) - vidrio oscuro
    ctx.fillStyle = '#2a3a4a'; // Azul gris oscuro (vidrio)
    ctx.fillRect(centerX - 4, y + 10, 8, 6);
    
    // Reflejo de la cabina
    ctx.fillStyle = '#6a8a9a'; // Azul gris claro (reflejo)
    ctx.fillRect(centerX - 3, y + 11, 6, 2);
    
    // Highlight brillante del vidrio
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(centerX - 2, y + 11, 3, 1);

    // Alas delta (tipo caza militar) - más grandes y angulares
    ctx.fillStyle = '#888888'; // Gris claro
    
    // Ala izquierda
    ctx.beginPath();
    ctx.moveTo(centerX - 6, y + h/2 - 4);
    ctx.lineTo(x + 2, y + h/2 + 8);
    ctx.lineTo(x + 6, y + h/2 + 10);
    ctx.lineTo(centerX - 6, y + h/2 + 4);
    ctx.closePath();
    ctx.fill();
    
    // Ala derecha
    ctx.beginPath();
    ctx.moveTo(centerX + 6, y + h/2 - 4);
    ctx.lineTo(x + w - 2, y + h/2 + 8);
    ctx.lineTo(x + w - 6, y + h/2 + 10);
    ctx.lineTo(centerX + 6, y + h/2 + 4);
    ctx.closePath();
    ctx.fill();
    
    // Detalles de las alas (paneles)
    ctx.fillStyle = '#707070';
    ctx.fillRect(x + 8, y + h/2 + 6, 8, 2);
    ctx.fillRect(x + w - 16, y + h/2 + 6, 8, 2);

    // Estabilizadores verticales (cola vertical)
    ctx.fillStyle = '#787878';
    ctx.fillRect(centerX - 7, y + h - 12, 3, 10);
    ctx.fillRect(centerX + 4, y + h - 12, 3, 10);
    
    // Aletas traseras pequeñas
    ctx.fillStyle = '#888888';
    ctx.fillRect(centerX - 10, y + h - 8, 2, 6);
    ctx.fillRect(centerX + 8, y + h - 8, 2, 6);

    // Motores (toberas de escape) - dobles
    ctx.fillStyle = '#404040'; // Gris muy oscuro
    ctx.fillRect(centerX - 8, y + h - 4, 4, 4);
    ctx.fillRect(centerX + 4, y + h - 4, 4, 4);
    
    // Fuego/escape de los motores (naranja)
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(centerX - 7, y + h, 3, 2);
    ctx.fillRect(centerX + 5, y + h, 3, 2);
    
    // Fuego interno (amarillo brillante)
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(centerX - 6.5, y + h, 2, 1);
    ctx.fillRect(centerX + 5.5, y + h, 2, 1);

    // Marcas militares (estrella pequeña en el ala izquierda)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 8, y + h/2 + 4, 2, 2);
    ctx.fillRect(x + 9, y + h/2 + 3, 1, 4);
    ctx.fillRect(x + 7, y + h/2 + 5, 4, 1);

    // Contorno para definición
    ctx.strokeStyle = '#606060';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(centerX - 6, y + 8, 12, h - 16);

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
   * Move left
   */
  public moveLeft(): void {
    this.velocity.x = -GAME_CONFIG.PLAYER_SPEED;
  }

  /**
   * Move right
   */
  public moveRight(): void {
    this.velocity.x = GAME_CONFIG.PLAYER_SPEED;
  }

  /**
   * Stop horizontal movement
   */
  public stopMovement(): void {
    this.velocity.x = 0;
  }

  /**
   * Attempt to shoot
   * @returns true if shot was fired
   */
  public shoot(): boolean {
    if (this.canShoot && this.shootCooldown <= 0) {
      this.canShoot = false;
      this.shootCooldown = GAME_CONFIG.PLAYER_SHOOT_COOLDOWN;
      return true;
    }
    return false;
  }

  /**
   * Take damage
   */
  public hit(): void {
    if (this.invulnerable) return;

    this.lives--;
    if (this.lives > 0) {
      this.makeInvulnerable();
    } else {
      this.active = false;
    }
  }

  /**
   * Make player invulnerable temporarily
   */
  private makeInvulnerable(): void {
    this.invulnerable = true;
    this.invulnerableTime = GAME_CONFIG.INVULNERABLE_TIME;
    this.blinkTimer = 0;
  }

  /**
   * Reset player position
   */
  public reset(): void {
    this.position.x = this.canvasWidth / 2 - this.width / 2;
    this.position.y = this.canvasHeight - this.height - 10;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.active = true;
    this.canShoot = true;
    this.shootCooldown = 0;
    this.makeInvulnerable();
  }

  /**
   * Get bullet spawn position (top center of player)
   */
  public getBulletSpawnPosition(): Vector2 {
    return {
      x: this.position.x + this.width / 2 - GAME_CONFIG.BULLET_WIDTH / 2,
      y: this.position.y - GAME_CONFIG.BULLET_HEIGHT,
    };
  }
}


