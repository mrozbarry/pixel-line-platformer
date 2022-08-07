import { composable, selectAll, replace, map } from 'composable-state';
import * as Entity from './entity.js';

export const handleInput = (now, state) => {
  const delta = state.frame.now
    ? now - state.frame.now
    : 0;


  let currentState = composable(state, selectAll({
    frame: selectAll({
      accumulator: replace(old => old + delta),
      now: replace(now),
      delta: replace(delta),
    }),
  }));

  while (currentState.frame.accumulator >= currentState.frame.rate) {
    currentState = composable(currentState, selectAll({
      frame: selectAll({
        accumulator: replace(old => old - currentState.frame.rate),
        number: replace(old => old + 1),
      }),
      entities: map(replace(entity => Entity.step(
        currentState.frame.rate,
        0.1,
        currentState.level,
        currentState.geometries,
        currentState.entities,
        entity,
      ))),
    }));
  }

  return currentState;
};
