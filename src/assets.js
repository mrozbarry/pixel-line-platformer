import { c } from 'declarativas';

import tilemapPacked from './assets/tilemap_packed.png';

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(src);
  img.src = src;
});

export const load = async (canvas) => {
  const tileSize = 16;
  const rows = 6;
  const cols = 10;

  const ctx = canvas.getContext('2d');

  canvas.width = tileSize * cols;
  canvas.height = tileSize * rows;

  const image = await loadImage(tilemapPacked);

  console.log('assets.js', 'load', tilemapPacked, image);

  ctx.clearRect(0, 0, image.width, image.height);
  ctx.drawImage(image, 0, 0);

  const rowIter = Array.from({ length: rows }, (_, y) => y);
  const colIter = Array.from({ length: cols}, (_, x) => x);

  const tileData = rowIter.reduce(
    (data, y) => data.concat(
      colIter.map(x => ({ x: x * tileSize, y: y * tileSize }))
    ),
    [],
  );

  return {
    tileData,
    canvas,
    render: (props) => [
      c('save'),
      c('translate', { x: props.x || 0, y: props.y || 0 }),
      c('scale', { x: props.mirror ? -1 : 1, y: 1 }),
      c(
        'drawImage',
        {
          image,
          source: { ...tileData[props.index], width: tileSize - 1, height: tileSize },
          destination: { x: props.mirror ? -tileSize : 0, y: 0, width: tileSize, height: tileSize },
        },
      ),
      c('restore'),
    ],
  };
};
