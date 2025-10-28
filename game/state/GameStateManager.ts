/**
 * Game State Manager - Central game logic controller
 */

import { Player } from '../entities/Player';
import { Bullet } from '../entities/Bullet';
import { Formation } from '../entities/Formation';
import { entitiesCollide } from '../engine/collisions';
import type { Game, GameState, LevelConfig, SoundEffect } from '../engine/types';
import { GAME_CONFIG } from '../engine/types';

export class GameStateManager {
  private game: Game;
  private onStateChange?: (state: GameState) => void;
  private onScoreChange?: (score: number, highScore: number) => void;
  private onLivesChange?: (lives: number) => void;
  private onLevelChange?: (level: number) => void;
  private onPlaySound?: (effect: SoundEffect) => void;
  private autoShootTimer: number = 0;
  private autoShootEnabled: boolean = false;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    highScore: number = 0
  ) {
    this.game = {
      state: 'menu',
      player: null,
      enemies: [],
      playerBullets: [],
      enemyBullets: [],
      formation: null,
      score: 0,
      highScore,
      level: 1,
      lives: 3,
      canvas: {
        width: canvasWidth,
        height: canvasHeight,
      },
      settings: {
        muted: false,
      },
    };
  }

  /**
   * Enable/disable auto-shoot for mobile
   */
  public setAutoShoot(enabled: boolean): void {
    this.autoShootEnabled = enabled;
  }

  /**
   * Set player position directly (for touch controls)
   */
  public setPlayerPosition(x: number): void {
    if (this.game.player) {
      this.game.player.position.x = Math.max(
        0,
        Math.min(x - this.game.player.width / 2, this.game.canvas.width - this.game.player.width)
      );
    }
  }

  /**
   * Set callbacks
   */
  public setCallbacks(callbacks: {
    onStateChange?: (state: GameState) => void;
    onScoreChange?: (score: number, highScore: number) => void;
    onLivesChange?: (lives: number) => void;
    onLevelChange?: (level: number) => void;
    onPlaySound?: (effect: SoundEffect) => void;
  }): void {
    this.onStateChange = callbacks.onStateChange;
    this.onScoreChange = callbacks.onScoreChange;
    this.onLivesChange = callbacks.onLivesChange;
    this.onLevelChange = callbacks.onLevelChange;
    this.onPlaySound = callbacks.onPlaySound;
  }

  /**
   * Start a new game
   */
  public startGame(): void {
    this.game.score = 0;
    this.game.level = 1;
    this.game.lives = 3;
    this.initializeLevel();
    this.setState('playing');
    this.notifyScoreChange();
    this.notifyLivesChange();
    this.notifyLevelChange();
  }

  /**
   * Initialize level
   */
  private initializeLevel(): void {
    this.game.player = new Player(
      this.game.canvas.width,
      this.game.canvas.height,
      this.game.lives
    );
    
    this.game.formation = new Formation(
      this.game.canvas.width,
      this.game.level
    );
    
    this.game.enemies = this.game.formation.getEnemies();
    this.game.playerBullets = [];
    this.game.enemyBullets = [];
  }

  /**
   * Update game state
   */
  public update(deltaTime: number, input: {
    left: boolean;
    right: boolean;
    shoot: boolean;
  }): void {
    if (this.game.state !== 'playing') return;

    // Update player
    if (this.game.player) {
      if (input.left) {
        this.game.player.moveLeft();
      } else if (input.right) {
        this.game.player.moveRight();
      } else {
        this.game.player.stopMovement();
      }

      if (input.shoot && this.game.player.shoot()) {
        const bulletPos = this.game.player.getBulletSpawnPosition();
        const bullet = new Bullet(
          bulletPos,
          'player',
          this.game.canvas.width,
          this.game.canvas.height
        );
        this.game.playerBullets.push(bullet);
        this.playSound('shoot');
      }

      // Auto-shoot para móvil (MUCHO más rápido para compensar la dificultad extrema)
      if (this.autoShootEnabled) {
        // El jugador dispara MUCHO más rápido en niveles altos
        const levelMultiplier = 1 + (this.game.level - 1) * 0.8; // Duplicado el multiplicador
        const shootInterval = GAME_CONFIG.PLAYER_SHOOT_COOLDOWN / levelMultiplier;
        this.autoShootTimer += deltaTime;
        
        if (this.autoShootTimer >= shootInterval && this.game.player.shoot()) {
          const bulletPos = this.game.player.getBulletSpawnPosition();
          const bullet = new Bullet(
            bulletPos,
            'player',
            this.game.canvas.width,
            this.game.canvas.height
          );
          this.game.playerBullets.push(bullet);
          this.playSound('shoot');
          this.autoShootTimer = 0;
        }
      }

      this.game.player.update(deltaTime);
    }

    // Update formation
    if (this.game.formation) {
      this.game.formation.update(deltaTime);
      this.game.enemies = this.game.formation.getEnemies();

      // Enemy shooting - LLUVIA MASIVA de balas
      const shootProbability = this.getEnemyShootProbability() * deltaTime;
      
      // MUCHOS más disparos simultáneos por frame
      const maxShots = 3 + Math.floor(this.game.level); // Nivel 1: 4, Nivel 3: 6, Nivel 5: 8 balas por frame!
      
      for (let i = 0; i < maxShots; i++) {
        if (Math.random() < shootProbability) {
          const shooter = this.game.formation.getRandomShootingEnemy();
          if (shooter) {
            const bulletPos = shooter.getBulletSpawnPosition();
            const bullet = new Bullet(
              bulletPos,
              'enemy',
              this.game.canvas.width,
              this.game.canvas.height
            );
            this.game.enemyBullets.push(bullet);
          }
        }
      }

      // Check if enemies reached bottom
      if (this.game.formation.hasReachedBottom(this.game.canvas.height)) {
        this.playerHit();
      }

      // Check if level cleared
      if (this.game.formation.isCleared()) {
        this.levelComplete();
      }
    }

    // Update bullets
    this.game.playerBullets.forEach(bullet => bullet.update(deltaTime));
    this.game.enemyBullets.forEach(bullet => bullet.update(deltaTime));

    // Remove inactive bullets
    this.game.playerBullets = this.game.playerBullets.filter(b => b.active);
    this.game.enemyBullets = this.game.enemyBullets.filter(b => b.active);

    // Check collisions
    this.checkCollisions();
  }

  /**
   * Check all collisions
   */
  private checkCollisions(): void {
    if (!this.game.player) return;

    // Player bullets vs enemies
    this.game.playerBullets.forEach(bullet => {
      if (!bullet.active) return;

      this.game.enemies.forEach(enemy => {
        if (!enemy.active) return;

        if (entitiesCollide(bullet, enemy)) {
          bullet.destroy();
          enemy.destroy();
          this.addScore(enemy.points);
          this.playSound('explosion');
        }
      });
    });

    // Enemy bullets vs player
    if (!this.game.player.invulnerable) {
      this.game.enemyBullets.forEach(bullet => {
        if (!bullet.active) return;

        if (entitiesCollide(bullet, this.game.player!)) {
          bullet.destroy();
          this.playerHit();
        }
      });
    }
  }

  /**
   * Player was hit
   */
  private playerHit(): void {
    if (!this.game.player || this.game.player.invulnerable) return;

    this.game.player.hit();
    this.game.lives = this.game.player.lives;
    this.notifyLivesChange();
    this.playSound('hit');

    if (this.game.lives <= 0) {
      this.gameOver();
    } else {
      // Clear enemy bullets
      this.game.enemyBullets = [];
    }
  }

  /**
   * Add score
   */
  private addScore(points: number): void {
    this.game.score += points;
    if (this.game.score > this.game.highScore) {
      this.game.highScore = this.game.score;
    }
    this.notifyScoreChange();
  }

  /**
   * Level complete
   */
  private levelComplete(): void {
    // Si alcanzó el nivel 5, es victoria total
    if (this.game.level >= 5) {
      this.setState('gameOver');
      this.playSound('levelUp');
    } else {
      this.setState('levelComplete');
      this.playSound('levelUp');
    }
  }

  /**
   * Continue to next level
   */
  public nextLevel(): void {
    if (this.game.level < 5) {
      this.game.level++;
      this.notifyLevelChange();
      this.initializeLevel();
      this.setState('playing');
    }
  }

  /**
   * Game over
   */
  private gameOver(): void {
    this.setState('gameOver');
    this.playSound('gameOver');
  }

  /**
   * Pause game
   */
  public pause(): void {
    if (this.game.state === 'playing') {
      this.setState('paused');
    }
  }

  /**
   * Resume game
   */
  public resume(): void {
    if (this.game.state === 'paused') {
      this.setState('playing');
    }
  }

  /**
   * Toggle pause
   */
  public togglePause(): void {
    if (this.game.state === 'playing') {
      this.pause();
    } else if (this.game.state === 'paused') {
      this.resume();
    }
  }

  /**
   * Draw game
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    // Draw stars background
    this.drawStars(ctx);

    if (this.game.state === 'playing' || this.game.state === 'paused') {
      // Draw player
      this.game.player?.draw(ctx);

      // Draw enemies
      this.game.enemies.forEach(enemy => enemy.draw(ctx));

      // Draw bullets
      this.game.playerBullets.forEach(bullet => bullet.draw(ctx));
      this.game.enemyBullets.forEach(bullet => bullet.draw(ctx));

      // Draw pause overlay
      if (this.game.state === 'paused') {
        this.drawPauseOverlay(ctx);
      }
    }
  }

  /**
   * Draw stars background
   */
  private drawStars(ctx: CanvasRenderingContext2D): void {
    const stars = 50;
    ctx.fillStyle = '#ffffff';
    
    for (let i = 0; i < stars; i++) {
      const x = (i * 7 + 13) % this.game.canvas.width;
      const y = (i * 11 + 17) % this.game.canvas.height;
      const size = (i % 3) === 0 ? 2 : 1;
      ctx.fillRect(x, y, size, size);
    }
  }

  /**
   * Draw pause overlay
   */
  private drawPauseOverlay(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSA', this.game.canvas.width / 2, this.game.canvas.height / 2);
    
    ctx.font = '16px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Presiona P para continuar', this.game.canvas.width / 2, this.game.canvas.height / 2 + 40);
  }

  /**
   * Get enemy shoot probability based on level
   */
  private getEnemyShootProbability(): number {
    return GAME_CONFIG.BASE_SHOOT_PROBABILITY * (1 + this.game.level * 0.3);
  }

  /**
   * Set game state
   */
  private setState(state: GameState): void {
    this.game.state = state;
    this.onStateChange?.(state);
  }

  /**
   * Notify score change
   */
  private notifyScoreChange(): void {
    this.onScoreChange?.(this.game.score, this.game.highScore);
  }

  /**
   * Notify lives change
   */
  private notifyLivesChange(): void {
    this.onLivesChange?.(this.game.lives);
  }

  /**
   * Notify level change
   */
  private notifyLevelChange(): void {
    this.onLevelChange?.(this.game.level);
  }

  /**
   * Play sound
   */
  private playSound(effect: SoundEffect): void {
    this.onPlaySound?.(effect);
  }

  /**
   * Get game state
   */
  public getState(): GameState {
    return this.game.state;
  }

  /**
   * Get score
   */
  public getScore(): number {
    return this.game.score;
  }

  /**
   * Get high score
   */
  public getHighScore(): number {
    return this.game.highScore;
  }

  /**
   * Get level
   */
  public getLevel(): number {
    return this.game.level;
  }

  /**
   * Get lives
   */
  public getLives(): number {
    return this.game.lives;
  }

  /**
   * Set high score
   */
  public setHighScore(highScore: number): void {
    this.game.highScore = highScore;
  }

  /**
   * Set muted
   */
  public setMuted(muted: boolean): void {
    this.game.settings.muted = muted;
  }

  /**
   * Reset game
   */
  public reset(): void {
    this.game.state = 'menu';
    this.game.player = null;
    this.game.enemies = [];
    this.game.playerBullets = [];
    this.game.enemyBullets = [];
    this.game.formation = null;
    this.game.score = 0;
    this.game.level = 1;
    this.game.lives = 3;
  }
}


