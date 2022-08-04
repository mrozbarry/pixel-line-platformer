const groundTiles = [3, 4, 5, 6, 7, 8, 9, 19, 20, 21, 22, 27, 28];
// const edgeTiles = [23, 24, 25, 26];

const collidable = (topLeft, size, type) => ({
  type,
  topLeft: {
    x: Math.floor(topLeft.x),
    y: Math.floor(topLeft.y),
  },
  bottomRight: {
    x: Math.floor(topLeft.x + size.x),
    y: Math.floor(topLeft.y + size.y),
  },
});

const TYPE_GEOMETRY = 'geometry';
const TYPE_ENTITY = 'entity';

const geometry = (topLeft, size) => collidable(topLeft, size, TYPE_GEOMETRY);
const entity = (bottomMiddle, size = { x: 16, y: 16 }) => collidable({
  x: bottomMiddle.x - (size.x / 2),
  y: bottomMiddle.y - size.y,
}, size, TYPE_ENTITY);

export const geometriesFromLevel = (level) => {
  return level.reduce((geometries, row, y) => {
    let groundStart = null;
    for (let x = 0; x < row.length; x++) {
      const tile = level[y][x];
      if (groundStart === null && groundTiles.includes(tile)) {
        groundStart = x;
      }
      if (groundStart !== null && !groundTiles.includes(tile)) {
        geometries.push(geometry({
          x: groundStart * 16,
          y: y * 16,
        },
          {
          x: Math.abs(groundStart - x) * 16,
          y: 6,
        }));
        groundStart = null;
      }
    }
    if (groundStart !== null) {
      geometries.push(geometry({
        x: groundStart * 16,
        y: y * 16,
      }, {
        x: Math.abs(groundStart - row.length - 2) * 16,
        y: 6,
      }));
    }
    return geometries;
  }, []);
};

export const collidables = (entities, level) => {
  return {
    entities: new Map(
      entities.map(e => [
        e,
        entity(e.p),
      ])
    ),
    geometry: geometriesFromLevel(level),
  };
};

const overlaps = (a, b) => {
  if (a.topLeft.x > b.bottomRight.x || b.topLeft.x > a.bottomRight.x) return false;
  if (a.topLeft.y > b.bottomRight.y || b.topLeft.y > a.bottomRight.y) return false;
  return true;
};

export const test = (geometries, dynamicObject) => {
  const e = entity(dynamicObject.p, { x: 10, y: 16 });
  return geometries.filter(g => (
    overlaps(e, g)
  ));
};
