/**
 * Tests for collision detection system
 */

import {
  checkCollision,
  pointInRect,
  getRectCenter,
  distance,
  clamp,
} from '../game/engine/collisions';
import type { Rectangle } from '../game/engine/types';

describe('Collision Detection', () => {
  describe('checkCollision', () => {
    it('should detect collision when rectangles overlap', () => {
      const rect1: Rectangle = { x: 0, y: 0, width: 10, height: 10 };
      const rect2: Rectangle = { x: 5, y: 5, width: 10, height: 10 };

      expect(checkCollision(rect1, rect2)).toBe(true);
    });

    it('should not detect collision when rectangles do not overlap', () => {
      const rect1: Rectangle = { x: 0, y: 0, width: 10, height: 10 };
      const rect2: Rectangle = { x: 20, y: 20, width: 10, height: 10 };

      expect(checkCollision(rect1, rect2)).toBe(false);
    });

    it('should detect collision when rectangles touch edges', () => {
      const rect1: Rectangle = { x: 0, y: 0, width: 10, height: 10 };
      const rect2: Rectangle = { x: 10, y: 10, width: 10, height: 10 };

      expect(checkCollision(rect1, rect2)).toBe(false);
    });

    it('should detect collision when one rectangle is inside another', () => {
      const rect1: Rectangle = { x: 0, y: 0, width: 20, height: 20 };
      const rect2: Rectangle = { x: 5, y: 5, width: 5, height: 5 };

      expect(checkCollision(rect1, rect2)).toBe(true);
    });
  });

  describe('pointInRect', () => {
    it('should return true when point is inside rectangle', () => {
      const point = { x: 5, y: 5 };
      const rect: Rectangle = { x: 0, y: 0, width: 10, height: 10 };

      expect(pointInRect(point, rect)).toBe(true);
    });

    it('should return false when point is outside rectangle', () => {
      const point = { x: 15, y: 15 };
      const rect: Rectangle = { x: 0, y: 0, width: 10, height: 10 };

      expect(pointInRect(point, rect)).toBe(false);
    });

    it('should return true when point is on rectangle edge', () => {
      const point = { x: 10, y: 10 };
      const rect: Rectangle = { x: 0, y: 0, width: 10, height: 10 };

      expect(pointInRect(point, rect)).toBe(true);
    });
  });

  describe('getRectCenter', () => {
    it('should calculate center point correctly', () => {
      const rect: Rectangle = { x: 0, y: 0, width: 10, height: 10 };
      const center = getRectCenter(rect);

      expect(center.x).toBe(5);
      expect(center.y).toBe(5);
    });

    it('should calculate center for offset rectangle', () => {
      const rect: Rectangle = { x: 10, y: 20, width: 30, height: 40 };
      const center = getRectCenter(rect);

      expect(center.x).toBe(25);
      expect(center.y).toBe(40);
    });
  });

  describe('distance', () => {
    it('should calculate distance between two points', () => {
      const a = { x: 0, y: 0 };
      const b = { x: 3, y: 4 };

      expect(distance(a, b)).toBe(5);
    });

    it('should return 0 for same point', () => {
      const a = { x: 5, y: 5 };
      const b = { x: 5, y: 5 };

      expect(distance(a, b)).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const a = { x: -3, y: -4 };
      const b = { x: 0, y: 0 };

      expect(distance(a, b)).toBe(5);
    });
  });

  describe('clamp', () => {
    it('should clamp value below minimum', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should clamp value above maximum', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should not clamp value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('should handle edge values', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });
});


