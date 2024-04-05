import { union } from '../lib/array.js';

export const types = {
  empty: 0,
  ground: 1,
};

const includeTileIdInTiles = (tiles) => {
  return Object.keys(tiles).reduce((map, tileId) => ({
    ...map,
    [tileId]: {
      ...tiles[tileId],
      tileId,
    },
  }), tiles);
};

export const tiles = includeTileIdInTiles({
  0: {
    id: 'empty-blank',
    type: types.empty,
    connectors: {
      up: [types.empty, types.ground],
      left: [types.empty, types.ground],
      right: [types.empty, types.ground],
      down: [types.empty, types.ground],
    },
  },

  4: {
    id: 'ground-flat',
    type: types.ground,
    connectors: {
      up: [types.empty],
      left: [types.ground],
      right: [types.ground],
      down: [types.empty, types.ground]
    },
  },

  9: {
    id: 'ground-platform-single-closed',
    type: types.ground,
    connectors: {
      up: [types.empty, types.ground],
      left: [types.empty],
      right: [types.empty],
      down: [types.empty, types.ground],
    }
  },

  23: {
    id: 'ground-edge-right',
    type: types.ground,
    connectors: {
      up: [types.empty, types.ground],
      left: [types.ground],
      right: [types.empty],
      down: [types.empty, types.ground],
    }
  },
   
  24: {
    id: 'ground-edge-left',
    type: types.ground,
    connectors: {
      up: [types.empty, types.ground],
      left: [types.empty],
      right: [types.ground],
      down: [types.empty, types.ground],
    }
  },

});

const directions = {
  left: 'left',
  up: 'up',
  right: 'right',
  down: 'down',
};

const inversions = {
  left: 'right',
  up: 'down',
  right: 'left',
  down: 'up',
};

export const filter = (potentialTileIds, tileId, direction) => {
  if (tileId === null) {
    //console.log('filter.noTile', potentialTileIds, tileId, direction);
    return potentialTileIds;
  }

  const current = tiles[tileId];
  if (!current) {
    return potentialTileIds;
  }
  const currentConnectors = current.connectors[direction];
  const inverseDirection = inversions[direction];
  // console.log('filter', tileId, current);
  return potentialTileIds
    .filter((id) => {
      const tile = tiles[id];
      const tileConnectors = tile.connectors[inverseDirection];
      const tileConnectsToCurrent = tileConnectors.includes(current.type);
      const currentConnectsToTile = currentConnectors.includes(tile.type);
      return tileConnectors.includes(current.type) && currentConnectors.includes(tile.type);
      const result = union(currentConnectors, tileConnectors);
      console.log('union', tileId, currentConnectors, direction, id, tileConnectors, 'union=', result);
      if (result.length > 0) {
        console.log('filter.match', tile);
      }
      return result.length > 0;
      if (matchingTypes.length === 0) {
        return false;
      }

      if (tile.type === currentTile.type) {
        console.log('rules.filter', 'same type',  direction, '->', inversions[direction], currentConnectors, tileConnectors);
        return true;
      }

      console.log('rules.filter', 'not same type',  direction, '->', inversions[direction], currentConnectors, tileConnectors);

      return false;

      const isSameTypeAndConnectorsMatch = tile.type === currentTile.type
        && currentTile.connectors[direction] === tile.connectors[inversions[direction]];

      return isSameTypeAndConnectorsMatch;

      const isDifferentTypeWithoutConnections = tile.type !== currentTile.type
        && !currentTile.connectors[direction]
        && !tile.connectors[inversions[direction]];

      const isEmpty = tile.type === types.empty
        && !currentTile.connectors[direction];

      return isSameTypeAndConnectorsMatch
        || isDifferentTypeWithoutConnections
        || isEmpty;
    })
};

export const potentialTiles = (neighbours) => {
  console.log('potentialTiles', Object.values(directions));
  return Object.values(directions)
    .reduce(
      (list, direction) => filter(list, neighbours[direction], direction),
      Object.keys(tiles).map(Number),
    );
};
