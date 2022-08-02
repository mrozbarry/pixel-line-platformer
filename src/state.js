import * as Entity from './entity.js';

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
  projectiles: [],
});
