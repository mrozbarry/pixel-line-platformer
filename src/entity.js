const groundTiles = [3, 4, 5, 6, 7, 8, 9, 19, 20, 21, 22, 27, 28];
const edgeTiles = [23, 24, 25, 26];

export const make = (id, controller) => ({
  id,
  controller,
  keys: controller.read(),

  pp: {
    x: null,
    y: null,
  },
  p: {
    x: 0,
    y: 0,
  },
  v: {
    x: 0,
    y: 0,
  },

  mirror: false,

  onGround: false,
  isJumping: false,
});

const MAX_SPEED = 1.5

const getGameMapPosition = (p) => ({
  x: Math.floor(p.x / 16),
  y: Math.floor(p.y / 16),
});

export const step = (timestep, gravity, gameMap, entity) => {
  const keys = entity.controller.read(gameMap, entity);
  const pp = { ...entity.p };
  const p = {
    x: entity.p.x + (entity.v.x * timestep / 10),
    y: entity.p.y + (entity.v.y * timestep / 10),
  };
  const horizontalMovement = entity.onGround ? (Number(keys.right) - Number(keys.left)) * 0.3 * timestep / 10 : 0;
  const v = {
    x: Math.max(Math.min(entity.v.x + horizontalMovement / (timestep / 10), MAX_SPEED), -MAX_SPEED),
    y: entity.v.y + (gravity * timestep / 10) / (2 * timestep / 10),
  };
  let onGround = entity.onGround;
  let isJumping =  entity.isJumping;

  if (!keys.left && !keys.right) {
    v.x *= 0.8 
  }
  if (v.x < 0.05 && v.x > -0.05) {
    v.x = 0;
  }

  const mapPreviousPosition = getGameMapPosition(pp);
  const mapPosition = getGameMapPosition(p);
  if (gameMap[mapPosition.y]) {
    //const previousTile = gameMap[mapPreviousPosition.y][mapPreviousPosition.x];
    const tile = gameMap[mapPosition.y][mapPosition.x];
    if (keys.left || keys.right) {
      console.log('character on tile', entity.id, tile);
    }
  } else if(!gameMap[mapPosition.y] && v.y > 0) {
    console.log('grounded');
    v.y = 0;
    p.y = gameMap.length * 16;
    onGround = true;
    isJumping = false;
  }

  if (onGround && keys.up && !entity.keys.up) {
    console.log('jump', v);
    onGround = false;
    isJumping = true;
  }
  if (isJumping && keys.up) {
    console.log('jumping');
    v.y -= (0.08 * timestep / 10);
  }
  if (isJumping && (!keys.up || v.y < -0.8)) {
    console.log('jumping done');
    isJumping = false;
  }

  const directionChangedLeft = keys.left !== entity.keys.left && keys.left;
  const directionChangedRight = keys.right !== entity.keys.right && keys.right;

  return {
    ...entity,
    keys,
    pp: entity.p,
    p,
    v,
    mirror: directionChangedLeft ? true : (directionChangedRight ? false : entity.mirror),
    onGround,
    isJumping,
  };
};
