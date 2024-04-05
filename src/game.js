import './debug.js';
import * as Assets from './assets.js';
import * as HandbombedLevel from './level/handbombed.js';
import * as Level from './level.js';
import * as Rules from './level/rules.js';
import * as Input from './input.js';
import * as State from './state.js';
import { draw } from './draw.js';
import { handleInput } from './handleInput.js';
import { debounce } from './lib/debounce.js';
import { composable, selectAll, replace } from 'composable-state';

const canvas = debug('found canvas element')(document.querySelector('canvas'));

const frame = state => now => {
  requestAnimationFrame(frame(draw(handleInput(now, state))));
};

const onResize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log('canvas resize', canvas.width, canvas.height);
};

Promise.all([
  Assets.load(canvas).then(debug('loaded assets')),
  Level.generate(10, 10, Rules)
])
  .then(([
    assets,
    level,
  ]) => {
    console.log('level', level);
    onResize();
    window.addEventListener('resize', debounce(onResize, 250));

    const input = Input.keyboard();
    input.bind();

    requestAnimationFrame(
      frame(State.init(
        input,
        level,
        // HandbombedLevel.tiles,
        assets,
        canvas,
      )),
    );
  });
