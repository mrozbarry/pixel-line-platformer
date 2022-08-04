import * as CollisionMap from './collisionMap.js';

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

const MAX_SPEED = 1

export const step = (timestep, gravity, gameMap, geometries, entity) => {
  const keys = entity.controller.read(gameMap, entity);
  const pp = { ...entity.p };
  const p = {
    x: entity.p.x + (entity.v.x * timestep / 10),
    y: entity.p.y + (entity.v.y * timestep / 10),
  };
  const horizontalMovement = (Number(keys.right) - Number(keys.left)) * (entity.onGround ? 0.3 : 0.1) * timestep / 10;
  const v = {
    x: Math.max(Math.min(entity.v.x + horizontalMovement / (timestep / 10), MAX_SPEED), -MAX_SPEED),
    y: entity.v.y + ((entity.onGround ? 0 : gravity) * timestep / 10) / (2 * timestep / 10),
  };
  let onGround = entity.onGround;
  let isJumping =  entity.isJumping;

  if (!keys.left && !keys.right) {
    v.x *= 0.8;
  }
  if (!onGround) {
    v.x *= 0.98;
  }
  if (v.x < 0.05 && v.x > -0.05) {
    v.x = 0;
  }
  if (onGround && v.y > 0) {
    v.y = 0;
  }

  const collisions = CollisionMap.test(geometries, { p });
  const collision = collisions.find(c => (
    p.y >= c.topLeft.y && p.y <= c.bottomRight.y
  ));

  if (collision && p.y >= collision.topLeft.y && p.y <= collision.bottomRight.y && v.y > 0 && !onGround) {
    onGround = true;
    isJumping = false;
    v.y = 0;
    p.y = collision.topLeft.y;
  } else if(p.y >= 16*16) {
    v.y = 0;
    p.y = gameMap.length * 16;
    onGround = true;
    isJumping = false;
  } else if (!collision) {
    onGround = false;
  }

  if (onGround && keys.up && !entity.keys.up) {
    onGround = false;
    isJumping = true;
  }
  if (isJumping && keys.up) {
    v.y -= (0.08 * timestep / 10);
  }
  if (isJumping && (!keys.up || v.y < -0.8)) {
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
