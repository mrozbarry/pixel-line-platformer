import * as Entity from './entity.js';
import * as CollisionMap from './collisionMap.js';

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
  ],
  geometries: CollisionMap.geometriesFromLevel(level),
  projectiles: [],
});
