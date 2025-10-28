/**
 * Collision detection system using AABB (Axis-Aligned Bounding Box)
 */

import type { Rectangle, Entity } from './types';

/**
 * Check if two rectangles intersect
 * @param a First rectangle
 * @param b Second rectangle
 * @returns true if rectangles overlap
 */
export function checkCollision(a: Rectangle, b: Rectangle): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Check if two entities collide
 * @param entityA First entity
 * @param entityB Second entity
 * @returns true if entities collide
 */
export function entitiesCollide(entityA: Entity, entityB: Entity): boolean {
  if (!entityA.active || !entityB.active) {
    return false;
  }
  return checkCollision(entityA.getBounds(), entityB.getBounds());
}

/**
 * Check if a point is inside a rectangle
 * @param point Point with x and y coordinates
 * @param rect Rectangle to check
 * @returns true if point is inside rectangle
 */
export function pointInRect(
  point: { x: number; y: number },
  rect: Rectangle
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Get the center point of a rectangle
 * @param rect Rectangle
 * @returns Center point
 */
export function getRectCenter(rect: Rectangle): { x: number; y: number } {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

/**
 * Calculate distance between two points
 * @param a First point
 * @param b Second point
 * @returns Distance
 */
export function distance(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Clamp a value between min and max
 * @param value Value to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}


