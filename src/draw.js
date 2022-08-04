import { render, c } from 'declarativas';
import * as CollisionMap from './collisionMap.js';

const SCALE = 1.5;

export const draw = (state) => {
  const { entities, geometry } = CollisionMap.collidables(state.entities, state.level);
  render(
    state.canvas.getContext('2d'),
    [
      c('save'),
      c('scale', { x: SCALE, y: SCALE }),
      state.level.map((row, y) => row.map((cell, x) => state.assets.render({ index: cell, x: 16 * x, y: 16 * y }))),
      state.entities.map(e => [
        state.assets.render({
          index: !e.onGround
            ? 41
            : 40 + (e.v.x !== 0 ? Math.floor((state.frame.number % 10) / 5) : 0),
          x: e.p.x - 8,
          y: e.p.y - 16,
          mirror: e.mirror,
        }),
      ]),
      // ...geometry.map(g => [
      //   c('strokeStyle', { value: 'red' }),
      //   c('strokeRect', {
      //     x: g.topLeft.x,
      //     y: g.topLeft.y,
      //     width: g.bottomRight.x - g.topLeft.x,
      //     height: g.bottomRight.y - g.topLeft.y,
      //   }),
      // ]),
      // ...[...entities.values()].map(e => [
      //   c('strokeStyle', { value: 'green' }),
      //   c('strokeRect', {
      //     x: e.topLeft.x,
      //     y: e.topLeft.y,
      //     width: e.bottomRight.x - e.topLeft.x,
      //     height: e.bottomRight.y - e.topLeft.y,
      //   }),
      // ]),
      c('restore'),
    ],
  );
  return state;
};
