import * as Entity from './entity.js';
import * as CollisionMap from './collisionMap.js';
import * as Bee from './ai/bee.js';

export const init = (input, level, assets, canvas) => ({
  frame: {
    number: 0,
    accumulator: 0,
    rate: 1000 / 30,
    now: null,
    delta: null,
  },
  input,
  level,
  assets,
  canvas,
  entities: [
    Entity.make('player', input),
    Entity.position(
      { x: 200, y: 250 },
      Entity.maxSpeed(0.3, Entity.make('bee0', Bee.make(), true, Entity.BEE_ANIMATIONS)),
    ),
  ],
  geometries: CollisionMap.geometriesFromLevel(level),
  projectiles: [],
});
