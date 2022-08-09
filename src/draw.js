import { render, c } from 'declarativas';
import { TILE_SIZE, tiles, levelSize } from './config.js';
import * as Entity from './entity.js';

const SCALE = 1.5;

export const draw = (state) => {
  const canvasSize = {
    x: window.innerWidth,
    y: window.innerHeight,
  };

  let scale = SCALE;
  let rotate = 0;
  let translate = { x: 0, y: 0 };
  if (canvasSize.x >= canvasSize.y) {
    scale = canvasSize.x / levelSize.x;
  }

  const player = state.entities.find(e => e.id === 'player');

  const halfScreen = {
    x: (tiles.x / 2) * TILE_SIZE,
    y: (tiles.y / 2) * TILE_SIZE,

  };

  const cameraMin = {
    x: halfScreen.x,
    y: halfScreen.y,
  };
  const cameraMax = {
    x: (state.level[0].length * TILE_SIZE) - halfScreen.x,
    y: (state.level.length * TILE_SIZE) - (halfScreen.y * 2),
  };

  const camera = {
    x: halfScreen.x - Math.max(Math.min(player.p.x, cameraMax.x), cameraMin.x),
    y: halfScreen.y - Math.max(Math.min(player.p.y, cameraMax.y), cameraMin.y),
  };

  const transform = (children) => [
    c('save'),
    c('rotate', { value: rotate }),
    c('translate', translate),
    c('scale', { x: scale, y: scale }),
    c('translate', {
      x: camera.x,
      y: camera.y,
    }),
    children,
    c('restore'),
  ];

  render(
    state.canvas.getContext('2d'),
    [
      c('save'),
      c('imageSmoothingEnabled', { value: false }),
      c('clearRect', { x: 0, y: 0, width: canvasSize.x, height: canvasSize.y }),
      transform(
        state.level.map((row, y) => row.map((cell, x) => state.assets.render({
          index: cell,
          x: TILE_SIZE * x, y: TILE_SIZE * y,
        })))
      ),
      state.darkness > 0 && [
        c('fillStyle', { value: `rgba(0, 0, 0, ${1.0 - state.darkness})` }),
        c('fillRect', { x: 0, y: 0, width: state.canvas.width, height: state.canvas.height }),
      ],
      transform(
        state.entities.map(e => [
          state.assets.render({
            index: Entity.animate(state.frame.number, e),
            x: e.p.x - (TILE_SIZE / 2),
            y: e.p.y - TILE_SIZE,
            mirror: e.mirror,
          }),
        ])
      ),
      c('restore'),
    ],
  );
  return state;
};
