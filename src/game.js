import './debug.js';
import * as Assets from './assets.js';
import * as HandbombedLevel from './level/handbombed.js';
import * as Input from './input.js';
import * as State from './state.js';
import { draw } from './draw.js';
import { handleInput } from './handleInput.js';
import { composable, selectAll, replace } from 'composable-state';

const canvas = debug('found canvas element')(document.querySelector('canvas'));

const frame = state => now => {
  requestAnimationFrame(frame(draw(handleInput(now, state))));
};

Promise.all([
  Assets.load(canvas).then(debug('loaded assets')),
])
  .then(([
    assets
  ]) => {
    canvas.width = 16 * 40;
    canvas.height = 16 * 40;

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
