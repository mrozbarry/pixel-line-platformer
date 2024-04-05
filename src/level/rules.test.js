import test from 'ava';
import * as rules from './rules.js';

test('it filters down the tile list', (t) => {
  t.deepEqual(['0', '23'], rules.filter(Object.keys(rules.tiles), 9, 'right'));
});

test('it gives a list of potential tiles', (t) => {
  const list = rules.potentialTiles({
    up: null,
    left: 23,
    right: 24,
    down: null,
  });

  t.deepEqual([4], list);
});
