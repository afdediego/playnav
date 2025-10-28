/**
 * Game loop using requestAnimationFrame with fixed timestep
 */

import { GAME_CONFIG } from './types';

type UpdateCallback = (deltaTime: number) => void;
type RenderCallback = () => void;

export class GameLoop {
  private updateCallback: UpdateCallback;
  private renderCallback: RenderCallback;
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedDeltaTime: number = 1 / GAME_CONFIG.TARGET_FPS;
  private animationFrameId: number | null = null;

  constructor(updateCallback: UpdateCallback, renderCallback: RenderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
  }

  /**
   * Start the game loop
   */
  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now() / 1000;
    this.accumulator = 0;
    this.loop(this.lastTime);
  }

  /**
   * Stop the game loop
   */
  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main game loop
   */
  private loop = (currentTime: number): void => {
    if (!this.isRunning) return;

    // Convert to seconds
    currentTime = currentTime / 1000;
    
    // Calculate delta time (capped to prevent spiral of death)
    let deltaTime = currentTime - this.lastTime;
    deltaTime = Math.min(deltaTime, 0.1); // Cap at 100ms to prevent huge jumps
    
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // Fixed timestep updates
    while (this.accumulator >= this.fixedDeltaTime) {
      this.updateCallback(this.fixedDeltaTime);
      this.accumulator -= this.fixedDeltaTime;
    }

    // Render
    this.renderCallback();

    // Request next frame
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  /**
   * Check if loop is running
   */
  public get running(): boolean {
    return this.isRunning;
  }
}

/**
 * FPS counter utility
 */
export class FPSCounter {
  private frames: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 0;

  public update(): void {
    this.frames++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frames * 1000) / elapsed);
      this.frames = 0;
      this.lastTime = currentTime;
    }
  }

  public getFPS(): number {
    return this.fps;
  }

  public draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.save();
    ctx.fillStyle = '#00ff00';
    ctx.font = '8px monospace';
    ctx.fillText(`FPS: ${this.fps}`, x, y);
    ctx.restore();
  }
}


