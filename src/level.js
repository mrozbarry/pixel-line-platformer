import { union, randomItem } from './lib/array.js';

const DIRECTIONS = ['t', 'b', 'l', 'r'];
const OPPOSITES = {
  t: 'b',
  b: 't',
  l: 'r',
  r: 'l',
};

export const empty = (width, height) => (
  Array.from({ length: height }, () => Array.from({ length: width }, () => null))
);

export const each = (callback, gameMap) => {
  for(let y = 0; y < gameMap.length; y++) {
    const row = gameMap[y];
    for(let x = 0; x < row.length; x++) {
      callback(row[x], { x, y }, gameMap);
    }
  }
  return null;
};

export const find = (criteria, gameMap) => {
  for(let y = 0; y < gameMap.length; y++) {
    const row = gameMap[y];
    for(let x = 0; x < row.length; x++) {
      if (criteria(row[x], { x, y })) {
        return { x, y, cell: gameMap[y][x] };
      }
    }
  }
  return null;
};

export const map = (transformer, gameMap) => {
  const copy = JSON.parse(JSON.stringify(gameMap));
  for(let y = 0; y < gameMap.length; y++) {
    const row = gameMap[y];
    for(let x = 0; x < row.length; x++) {
      copy[y][x] = transformer(row[x], { x, y }, gameMap);
    }
  }
  return copy;
};

export const isComplete = (gameMap) => !find(c => c === null, gameMap);

export const findNextGenerateTarget = (Rules, gameMap) => {
  const candidates = [];

  each((cell, { x, y }) => {
    if (cell !== null) return;
    const neighbours = findNeighbours({ x, y }, gameMap);
    const possible = DIRECTIONS.reduce((tiles, d) => {
      const neighbour = neighbours[d];
      if (neighbour.tile === null) return tiles;

      const ruleTiles = Rules.connectors[neighbour.tile][OPPOSITES[d]];
      return union(tiles, ruleTiles);
    }, Rules.all);

    candidates.push({ x, y, possible, count: possible.length });
  }, gameMap);

  candidates.sort((a, b) => a.count > b.count);
  return candidates[0];
};

export const findNeighbours = ({ x, y }, gameMap) => {
  const up = gameMap[y - 1];
  const down = gameMap[y + 1];

  return {
    t: { x, y: y - 1, tile: up ? up[x] : null },
    b: { x, y: y + 1, tile: down ?  down[x] : null },
    l: { x: x - 1, y, tile: gameMap[y][x - 1] || null },
    r: { x: x + 1, y, tile: gameMap[y][x + 1] || null },
  };
};

const placeTile = (target, gameMap) => {
  let nextGameMap = JSON.parse(JSON.stringify(gameMap));

  const tile = target.possible.length > 1 ? randomItem(target.possible) : target.possible[0];
  nextGameMap[target.y][target.x] = tile;

  return nextGameMap;
};

export const generate = (width, height, Rules) => {
  let gameMap = empty(width, height);

  const startTime = Date.now();

  while (!isComplete(gameMap)) {
    const target = findNextGenerateTarget(Rules, gameMap);
    console.log('generate.loop', target);
    if (!target) {
      console.log('no target', gameMap);
      break;
    }

    const nextGameMap = placeTile(target, gameMap);

    gameMap = nextGameMap;

    if (Date.now() - startTime > 5000) {
      console.error('too long to generate');
      break;
    }
  }
  return gameMap;
};
