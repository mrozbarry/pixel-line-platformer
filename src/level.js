import { union, randomItem } from './lib/array.js';

const pipeline = (steps, init) => steps.reduce(async (memo, step) => step(await memo), init);

const inBounds = (x, y, gameMap) => {
  const xInBounds = x >= 0 || x <= gameMap.width;
  const yInBounds = y >= 0 || y <= gameMap.height;
  return xInBounds && yInBounds;
}

const coordsToIndex = (x, y, gameMap) => {
  if (!inBounds(x, y, gameMap)) {
    return -1;
  }
  return (y * gameMap.width) + x;
}

const neighbours = (x, y, gameMap) => {
  return [
    { name: 'left', x: x - 1, y }, // left
    { name: 'up', x, y: y - gameMap.width }, // up
    { name: 'right', x: x + 1, y }, // right
    { name: 'down', x, y: y + gameMap.width }, // down
  ]
    .filter(p => inBounds(p.x, p.y, gameMap))
    .map(p => ({ ...p, index: coordsToIndex(p.x, p.y, gameMap) }));
};

const inversions = {
  left: 'right',
  up: 'down',
  right: 'left',
  down: 'up',
};

const placeTile = (x, y, tileId, gameMap) => {
  const index = coordsToIndex(x, y, gameMap);
  if (index === -1 || gameMap.tiles[index] !== null) {
    return gameMap;
  }
  gameMap.tiles[index] = tileId;
  return gameMap;
};

const recursivelySetTile = (x, y, gameMap) => {
  const index = coordsToIndex(x, y, gameMap);
  if (index === -1) {
    return gameMap;
  }

  if (gameMap.tiles[index] !== null) {
    return gameMap;
  }

  const neighbours = [
    { name: 'left', x: x - 1, y },
    { name: 'up', x, y: y - 1 },
    { name: 'right', x: x + 1, y },
    { name: 'down', x, y: y + 1 },
  ];

  const tiles = gameMap.rules.potentialTiles({
    left: gameMap.tiles[coordsToIndex(x - 1, y, gameMap)],
    up: gameMap.tiles[coordsToIndex(x, y -1, gameMap)],
    right: gameMap.tiles[coordsToIndex(x + 1, y, gameMap)],
    down: gameMap.tiles[coordsToIndex(x, y + 1, gameMap)],
  });

  placeTile(x, y, tiles[Math.floor(Math.random() * tiles.length)], gameMap);

  return pipeline(
    neighbours.map(
      n => g => recursivelySetTile(n.x, n.y, g)
    ),
    gameMap,
  );
};

export const generate = (width, height, rules, seed = null) => {
  seed = seed === null
    ? Math.floor(Math.random() * 100)
    : parseInt(seed);

  return pipeline([
    g => placeTile(g.startPosition.x, g.startPosition.y, 9, g, false),
    async (g) => await recursivelySetTile(g.startPosition.x, g.startPosition.y - 1, g),
  ], {
    rules,
    width,
    height,
    seed,
    tiles: Array.from({ length: width * height }, () => null),
    startPosition: {
      x: Math.floor(width / 2),
      y: Math.floor(height / 2),
    },
  });
};
