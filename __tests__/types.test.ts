/**
 * Tests for game configuration and constants
 */

import { GAME_CONFIG, STORAGE_KEYS } from '../game/engine/types';

describe('Game Configuration', () => {
  describe('GAME_CONFIG', () => {
    it('should have valid canvas dimensions', () => {
      expect(GAME_CONFIG.CANVAS_WIDTH).toBeGreaterThan(0);
      expect(GAME_CONFIG.CANVAS_HEIGHT).toBeGreaterThan(0);
    });

    it('should have valid player configuration', () => {
      expect(GAME_CONFIG.PLAYER_SPEED).toBeGreaterThan(0);
      expect(GAME_CONFIG.PLAYER_WIDTH).toBeGreaterThan(0);
      expect(GAME_CONFIG.PLAYER_HEIGHT).toBeGreaterThan(0);
      expect(GAME_CONFIG.PLAYER_SHOOT_COOLDOWN).toBeGreaterThan(0);
    });

    it('should have valid bullet configuration', () => {
      expect(GAME_CONFIG.BULLET_SPEED).toBeGreaterThan(0);
      expect(GAME_CONFIG.BULLET_WIDTH).toBeGreaterThan(0);
      expect(GAME_CONFIG.BULLET_HEIGHT).toBeGreaterThan(0);
    });

    it('should have valid enemy configuration', () => {
      expect(GAME_CONFIG.ENEMY_WIDTH).toBeGreaterThan(0);
      expect(GAME_CONFIG.ENEMY_HEIGHT).toBeGreaterThan(0);
      expect(GAME_CONFIG.ENEMY_SPACING_X).toBeGreaterThan(0);
      expect(GAME_CONFIG.ENEMY_SPACING_Y).toBeGreaterThan(0);
    });

    it('should have valid game parameters', () => {
      expect(GAME_CONFIG.TARGET_FPS).toBe(60);
      expect(GAME_CONFIG.INVULNERABLE_TIME).toBeGreaterThan(0);
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have all required storage keys', () => {
      expect(STORAGE_KEYS.HIGH_SCORE).toBeDefined();
      expect(STORAGE_KEYS.MUTED).toBeDefined();
      expect(STORAGE_KEYS.MAX_LEVEL).toBeDefined();
    });

    it('should have unique storage keys', () => {
      const keys = Object.values(STORAGE_KEYS);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });

    it('should have prefixed storage keys', () => {
      const keys = Object.values(STORAGE_KEYS);
      keys.forEach(key => {
        expect(key).toContain('playnav_');
      });
    });
  });
});


