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

    if (!aiState.angryAt) {
      const targetEntity = entities
        .filter(e => e !== entity)
        .filter(e => e.id === 'player')
        .map(e => ({ ...e, dist: entityDistance(e, entity) }))
        .sort(e => e.dist)[0];

      if (targetEntity.dist <= 32) {
        aiState.angryAt = targetEntity.id;
        entity.maxSpeed *= 1.8;
        clearTimeout(aiState.handle);

        aiState.target = (list) => {
          const e = list.find(e => e.id === targetEntity.id);
          return {
            x: e.p.x,
            y: e.p.y - (TILE_SIZE / 2),
          };
        };
      }
    }

    const target = aiState.target(entities);

    const tolerance = TILE_SIZE / 2;

    const diffX = target ? target.x - entity.p.x : 0;
    const dx = Math.abs(diffX);
    const diffY = target ? target.y - entity.p.y : 0;
    const dy = Math.abs(diffY);
    const dist = Math.sqrt((diffX * diffX) + (diffY * diffY));
    if (!aiState.isAngry && (!target || dist < tolerance)) {
      const flowers = getTargetList(level);
      const flower = flowers[Math.floor(Math.random() * flowers.length)];

      aiState.timeout = setTimeout(() => {
        if (aiState.angryAt) return;
        aiState.target = () => ({
          x: flower.x + (TILE_SIZE / 2),
          y: flower.y + (TILE_SIZE / 2),
        });
      }, 3000);
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
    angryAt: null,
    frame: 0,
  }),
});
