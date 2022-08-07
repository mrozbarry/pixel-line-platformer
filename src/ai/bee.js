const entityDistance = (a, b) => {
  const diffX = b.p.x - a.p.x;
  const diffY = b.p.y - a.p.y;
  return Math.sqrt((diffX * diffX) + (diffY * diffY));
};

const read = (aiState) => {
  console.log('ai.bee.read.state', aiState);
  return (geometries, entities, lastKeys, entity) => {
    aiState.frame += 1;
    const targetEntity = entities
      .filter(e => e !== entity)
      .sort(entityDistance)
      [0];
    const target = targetEntity
      ? (entityDistance(entity, targetEntity) < 250 ? targetEntity.p : aiState.target)
      : aiState.target;
    const isTargettingEntity = target === targetEntity;

    const tolerance = isTargettingEntity
      ? 1
      : 10;

    const diffX = target ? target.x - entity.p.x : 0;
    const dx = Math.abs(diffX);
    const diffY = aiState.target ? target.y - entity.p.y : 0;
    const dist = Math.sqrt((diffX * diffX) + (diffY * diffY));
    if (dist < tolerance) {
      const x = [
        ...geometries.map(g => g.topLeft.x),
        ...geometries.map(g => g.bottomRight.x),
      ];
      const xMinMax = [
        Math.min(...x),
        Math.max(...x),
      ];
      const y = [
        ...geometries.map(g => g.topLeft.y),
        ...geometries.map(g => g.bottomRight.y),
      ];
      const yMinMax = [
        0,
        Math.max(...y),
      ];
      const xRange = xMinMax[1] - xMinMax[0];
      const yRange = yMinMax[1] - yMinMax[0];
      aiState.target = {
        x: xMinMax[0] + (Math.random() * xRange),
        y: yMinMax[0] + (Math.random() * yRange),
      };
    }
    const tick = targetEntity
      ? aiState.frame % 2 === 0
      : aiState.frame % 3 === 0;
    return {
      up: diffY < 0,
      down: false,
      left: tick && dx > tolerance && aiState.target.x < entity.p.x,
      right: tick && dx > tolerance && aiState.target.x > entity.p.x,
    };
  };
};

export const make = (initialState = {}) => ({
  read: read({
    ...initialState,
    target: null,
    frame: 0,
  }),
});
