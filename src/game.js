import './debug.js';
import * as Assets from './assets.js';
import * as HandbombedLevel from './level/handbombed.js';
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
])
  .then(([
    assets
  ]) => {
    onResize();
    window.addEventListener('resize', debounce(onResize, 250));

    const input = Input.keyboard();
    input.bind();

    requestAnimationFrame(
      frame(State.init(
        input,
        HandbombedLevel.tiles,
        assets,
        canvas,
      )),
    );
  });
