import * as CollisionMap from './collisionMap.js';
import { TILE_SIZE } from './config.js';

export const PLAYER_UNARMED_ANIMATIONS = {
  idle: [45],
  default: [45, 46],
  // walk: [40, 41],
  shoot: [45],
  fall: [46],
};

export const PLAYER_ARMED_ANIMATIONS = {
  idle: [40],
  default: [40, 41],
  // walk: [40, 41],
  shoot: [40, 42],
  fall: [41],
};

export const BEE_ANIMATIONS = {
  default: [51, 52],
};

export const MOTH_ANIMATIONS = {
  default: [53, 54],
};

export const getAnimation = (entity) => {
  if (entity.isFlying) return entity.animations.default;
  if (entity.onGround && Math.abs(entity.v.x) < 0.5) return entity.animations.idle || entity.animations.default;
  if (entity.onGround) return entity.animations.walk || entity.animations.default;
  if (!entity.onGround) return entity.animations.fall || entity.animations.default;
  return entity.animations.default;
};

export const animate = (frame, entity) => {
  const animation = getAnimation(entity);
  const scaledFrame = Math.floor((frame % entity.frameSkip) / (entity.frameScale));
  return animation[scaledFrame % animation.length];
  // : 40 + (e.v.x !== 0 ? Math.floor((state.frame.number % 10) / 5) : 0),
};

export const make = (id, controller, isFlying = false, animations = PLAYER_UNARMED_ANIMATIONS) => ({
  id,
  controller,
  keys: {
    up: false,
    down: false,
    left: false,
    right: false,
  },
  animations,
  frameSkip: 10,
  frameScale: 5,
  maxSpeed: 1,

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
  isFlying,
});

export const position = ({ x, y }, entity) => ({
  ...entity,
  p: { x, y },
  v: { x: 0, y: 0 },
});

export const maxSpeed = (maxSpeed, entity) => ({ ...entity, maxSpeed });

export const step = (timestep, gravity, level, geometries, entities, entity) => {
  const keys = entity.controller.read(geometries, entities, level, entity);
  const p = {
    x: entity.p.x + (entity.v.x * timestep / 10),
    y: entity.p.y + (entity.v.y * timestep / 10),
  };
  const horizontalMovement = (Number(keys.right) - Number(keys.left)) * (entity.onGround ? 0.3 : 0.1) * timestep / 10;
  const verticalMovement = (Number(keys.down) - Number(keys.up)) * 0.1 * timestep / 10;
  const localGravity = entity.onGround ? 0 : gravity;
  const v = entity.isFlying
    ? {
      x: Math.max(Math.min(entity.v.x + (horizontalMovement * timestep / 10), entity.maxSpeed), -entity.maxSpeed),
      y: Math.max(Math.min(entity.v.y + ((verticalMovement + (localGravity / 5)) * timestep / 10), entity.maxSpeed), -entity.maxSpeed),
    }
    : {
      x: Math.max(Math.min(entity.v.x + horizontalMovement / (timestep / 10), entity.maxSpeed), -entity.maxSpeed),
      y: Math.max(Math.min(entity.v.y + (localGravity * timestep / 10) / (2 * timestep / 10), 5), -5),
    };
  let onGround = entity.onGround;
  let isJumping =  entity.isJumping;


  if (!keys.left && !keys.right) {
    v.x *= 0.8;
  }
  if (entity.isFlying && !(keys.left || keys.right)) {
    v.y *= 0.8;
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

  if (!entity.isFlying) {
    const collisions = CollisionMap.test(geometries, { p });
    const collision = collisions.find(c => (
      p.y >= c.topLeft.y && p.y <= c.bottomRight.y
    ));

    if (collision && p.y >= collision.topLeft.y && p.y <= collision.bottomRight.y && v.y > 0 && !onGround) {
      onGround = true;
      isJumping = false;
      v.y = 0;
      p.y = collision.topLeft.y;
    } else if(p.y >= (level.length * TILE_SIZE)) {
      v.y = 0;
      p.y = level.length * TILE_SIZE;
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
    if (p.x < 0) {
      p.x = 0;
    }
    if (p.x > (level[0].length * TILE_SIZE)) {
      p.x = level[0].length * TILE_SIZE;
    }
  }

  const directionChangedLeft = keys.left !== entity.keys.left && keys.left;
  const directionChangedRight = keys.right !== entity.keys.right && keys.right;

  return {
    ...entity,
    keys,
    p,
    v,
    mirror: directionChangedLeft ? true : (directionChangedRight ? false : entity.mirror),
    onGround,
    isJumping,
  };
};
