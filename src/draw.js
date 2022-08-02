import { render, c } from 'declarativas';

const SCALE = 1.5;

export const draw = (state) => {
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
      c('restore'),
    ],
  );
  return state;
};
