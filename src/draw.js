import { render, c } from 'declarativas';

const SCALE = 1.5;

export const draw = (state) => {
  const levelSize = {
    x: state.level[0].length * 16,
    y: state.level.length * 16,
  };
  const canvasSize = {
    x: window.innerWidth,
    y: window.innerHeight,
  };

  const yScale = canvasSize.y / levelSize.y
  let scale = SCALE;
  let rotate = 0;
  let translate = { x: 0, y: 0 };
  if (canvasSize.x >= canvasSize.y) {
    scale = canvasSize.x / levelSize.x;
  } /*else if (canvasSize.y > canvasSize.x && canvasSize.x < 2048) {
    scale = yScale;
    rotate = 90 * Math.PI / 180;
    translate = { x: 0, y: -canvasSize.x };
  }*/

  render(
    state.canvas.getContext('2d'),
    [
      c('save'),
      c('imageSmoothingEnabled', { value: false }),
      c('clearRect', { x: 0, y: 0, width: canvasSize.x, height: canvasSize.y }),
      c('rotate', { value: rotate }),
      c('translate', translate),
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
