import * as Entity from './entity.js';
import * as CollisionMap from './collisionMap.js';
import * as Bee from './ai/bee.js';
import { TILE_SIZE } from './config.js';

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
    Entity.position(
      {
        x: level.startPosition.x * TILE_SIZE,
        y: level.startPosition.y * TILE_SIZE,
      },
      Entity.make('player', input),
    ),
    ...Array.from({ length: 5 }, (_, index) => Entity.position(
      {
        x: Math.random() * level.width * TILE_SIZE,
        y: Math.random() * level.height * TILE_SIZE,
      },
      // { x: Math.random() * (level[0].length * TILE_SIZE), y: Math.random() * (level.length * TILE_SIZE) },
      Entity.maxSpeed(0.3, Entity.make(`bee${index}`, Bee.make(), true, Entity.BEE_ANIMATIONS)),
    )),
  ],
  geometries: CollisionMap.geometriesFromLevel(level),
  projectiles: [],
  darkness: 0.0,
});
