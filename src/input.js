export const KEYBOARD_KEYMAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',

  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',

  j: 'up',
  k: 'down',
  h: 'left',
  l: 'right',
};

export const keyboard = (keymap = KEYBOARD_KEYMAP) => {
  let state = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  const keyDown = (event) => {
    if (!keymap[event.key]) return;
    event.preventDefault();
    if (event.repeat) return;
    state[keymap[event.key]] = true;
  };

  const keyUp = (event) => {
    if (!keymap[event.key]) return;
    event.preventDefault();
    state[keymap[event.key]] = false;
  };

  const bind = () => {
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
  };

  const unbind = () => {
    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);
  };

  const read = () => ({ ...state });

  return {
    bind,
    unbind,
    read,
  };
};
