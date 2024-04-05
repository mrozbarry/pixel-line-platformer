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
    scale = (canvasSize.x / levelSize.x);
  }

  const player = state.entities.find(e => e.id === 'player');

  const halfScreen = {
    x: ((tiles.x / 2) * TILE_SIZE),
    y: ((tiles.y / 2) * TILE_SIZE),
  };

  const cameraMin = {
    x: halfScreen.x,
    y: halfScreen.y,
  };
  const cameraMax = {
    x: (state.level.width * TILE_SIZE) - halfScreen.x,
    y: (state.level.height * TILE_SIZE) - (halfScreen.y * 2),
  };

  const camera = {
    x: halfScreen.x - Math.max(Math.min(player.p.x, cameraMax.x), cameraMin.x),
    y: halfScreen.y - Math.max(Math.min(player.p.y, cameraMax.y), cameraMin.y),
  };

  const topLeft = {
    x: -camera.x - (2 * TILE_SIZE),
    y: -camera.y - (3 * TILE_SIZE),
  };
  const bottomRight = {
    x: -camera.x + (tiles.x * TILE_SIZE) + (2 * TILE_SIZE),
    y: -camera.y + (tiles.y * TILE_SIZE) + (10 * TILE_SIZE),
  };
  const positionInBounds = ({ x, y }) => (
    (topLeft.x <= x)
      && (bottomRight.x >= x)
      &&(topLeft.y <= y)
      && (bottomRight.y >= y)
  );
  const entityInBounds = e => positionInBounds(e.p);

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

  const renderableTiles = state.level.tiles
    .map((tileId, index) => ({
      tileId,
      y: Math.floor(index / state.level.width) * TILE_SIZE,
      x: (index % state.level.width) * TILE_SIZE,
    }))
    .filter(positionInBounds);

  render(
    state.canvas.getContext('2d'),
    [
      c('save'),
      c('imageSmoothingEnabled', { value: false }),
      c('fillStyle', { value: '#fcdfcd' }),
      c('fillRect', { x: 0, y: 0, width: canvasSize.x, height: canvasSize.y }),
      transform(
        renderableTiles
          .map((tile) => {
            return state.assets.render({
              index: parseInt(tile.tileId),
              x: Math.floor(tile.x),
              y: Math.floor(tile.y),
            });
          }),
      ),
      // transform(
      //   state.level
      //   .map((row, y) => row.map((cell, x) => positionInBounds({ x: x * TILE_SIZE, y: y * TILE_SIZE }) && state.assets.render({
      //       index: cell,
      //       x: Math.floor(TILE_SIZE * x),
      //       y: Math.floor(TILE_SIZE * y),
      //     })))
      // ),
      state.darkness > 0 && [
        c('fillStyle', { value: `rgba(0, 0, 0, ${1.0 - state.darkness})` }),
        c('fillRect', { x: 0, y: 0, width: state.canvas.width, height: state.canvas.height }),
      ],
      transform(
        state.entities
          .filter(entityInBounds)
          .map(e => [
            state.assets.render({
              index: Entity.animate(state.frame.number, e),
              x: Math.floor(e.p.x - (TILE_SIZE / 2)),
              y: Math.floor(e.p.y - TILE_SIZE),
              mirror: e.mirror,
            }),
        ])
      ),
      transform(
        state.geometries
          .map(g => [
            c('strokeStyle', { value: '#f0f' }),
            c('strokeRect', { x: g.topLeft.x, y: g.topLeft.y, width: g.size.x, height: g.size.y }),
          ])
      ),
      c('restore'),
    ],
  );
  return state;
};
