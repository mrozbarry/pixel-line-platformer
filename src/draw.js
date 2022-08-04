import { render, c } from 'declarativas';

const SCALE = 1.5;

export const draw = (state) => {
  const levelSize = {
    x: state.level.length * 16,
    y: state.level[0].length * 16,
  };
  const canvasSize = {
    x: state.canvas.width,
    y: state.canvas.height,
  };

  let scale = SCALE;
  if (canvasSize.x > canvasSize.y) {
    scale = canvasSize.x / levelSize.x / 2;
  } else {
    scale = canvasSize.y / levelSize.y / 2;
  }

  render(
    state.canvas.getContext('2d'),
    [
      c('save'),
      c('scale', { x: scale, y: scale }),
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
