import { TILE_SIZE } from '../config.js';

const entityDistance = (a, b) => {
  const diffX = b.p.x - a.p.x;
  const diffY = b.p.y - a.p.y;
  return Math.sqrt((diffX * diffX) + (diffY * diffY));
};

const possibleTargets = tileIds => level => {
  return level.reduce((targets, row, y) => {
    return [
      ...targets,
      ...row.reduce((rowTargets, rowTileId, x) => {
        if (!tileIds.includes(rowTileId)) return rowTargets;
        return [
          ...rowTargets,
          { x: x * TILE_SIZE, y: y * TILE_SIZE },
        ];
      }, []),
    ];
  }, []);
};

const read = (aiState) => {
  const getTargetList = possibleTargets([32, 33, 34, 35]);

  return (_geometries, entities, level, entity) => {
    aiState.frame += 1;

    if (!aiState.followingEntityId) {
      const targetEntity = entities
        .filter(e => e !== entity)
        .filter(e => e.id === 'player')
        .map(e => ({ ...e, dist: entityDistance(e, entity) }))
        .sort(e => e.dist)[0];

      if (targetEntity.dist <= 32) {
        aiState.followingEntityId = targetEntity.id;
        entity.maxSpeed *= 1.2;
        clearTimeout(aiState.handle);

        aiState.target = (list) => {
          const e = list.find(e => e.id === targetEntity.id);
          return {
            x: e.p.x + (Math.random() * (TILE_SIZE / 4)) - (TILE_SIZE / 2),
            y: e.p.y - (TILE_SIZE / 2) + (Math.random() * (TILE_SIZE / 4)) - (TILE_SIZE / 2),
          };
        };
      }
    }

    const target = aiState.target(entities);

    const tolerance = aiState.followingEntityId
      ? (TILE_SIZE * (1 + Math.random()))
      : (TILE_SIZE / 3);

    const diffX = target ? target.x - entity.p.x : 0;
    const dx = Math.abs(diffX);
    const diffY = target ? target.y - entity.p.y : 0;
    const dy = Math.abs(diffY);
    const dist = Math.sqrt((diffX * diffX) + (diffY * diffY));
    if (!aiState.followingEntityId && (!target || dist < tolerance)) {
      const flowers = getTargetList(level);
      const flower = flowers[Math.floor(Math.random() * flowers.length)];

      aiState.timeout = setTimeout(() => {
        if (aiState.followingEntityId) return;
        aiState.target = () => ({
          x: flower.x + (TILE_SIZE / 2),
          y: flower.y + (TILE_SIZE / 2),
        });
      }, target ? 3000 : 0);
    }
    if (aiState.followingEntityId && dist > 72 && Math.random() > 0.2) {
      console.log('bee lost interest');
      aiState.followingEntityId = null;
      aiState.target = () => null;
      entity.maxSpeed *= 0.8;
    }

    if (!aiState.followingEntityId && Math.random() > 0.6) {
      return {
        up: false,
        down: false,
        left: false,
        right: false,
      };
    }

    const up = (dy > tolerance) && diffY < tolerance;
    const down = (dy > tolerance) && diffY > -tolerance;
    const left = (dx > tolerance) && (diffX < 0) && (entity.v.x > diffX);
    const right = (dx > tolerance) && (diffX > 0) && (entity.v.x < diffX);

    return {
      up,
      down,
      left,
      right,
    };
  };
};

export const make = (initialState = {}) => ({
  read: read({
    ...initialState,
    target: () => null,
    followingEntityId: null,
    frame: 0,
  }),
});
