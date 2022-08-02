import test from 'ava';
import { union } from './array.js';

test('union returns empty array when nothing is in common', (t) => {
  t.deepEqual(union(['a', 'b', 'c'], [1, 2, 3]), []);
});

test('union returns array of common elements', (t) => {
  t.deepEqual(union([1, 2, 3], [4, 3, 2]), [2, 3]);
});

test('union removes duplicates', (t) => {
  t.deepEqual(union([1, 2, 3, 3], [1, 2, 3]), [1, 2, 3]);
});
