const all = Array.from({ length: 30 }, (_, index) => index);

const sky = [0, 1, 2, 11, 12, 14, 17];
const landStart = [3, 6, 9, 19, 20, 24, 26, 27];
const landMiddle = [4, 7, 9, 1921, 22];
const landEnd = [5, 8, 9, 23, 25, 28];
const overhangMiddle = [13, 15];
const overhangBottom = [16, 18, 27, 28, 29];

const emptyTileRules = {
  top: [...sky, ...landMiddle, ...overhangBottom],
  bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
  left: [0, 2, 11, 12, ...landEnd, 5, 8, 9, 15, 18, 19, 23, 25, 28, 29],
  right: [0, 1, 11, 12, ...landStart, 3, 6, 9, 13, 16, 19, 20, 24, 26, 27, 29],
};

const landTop = [...sky, 4, 9, 20, 21, 22, 23, 24, 25, 26, 27, 28];

const union = (a, b) => {
  return Array.from(new Set(
    [...a, ...b].filter(v => a.includes(v) && b.includes(v))
  ));
};

const rules = {
  0: emptyTileRules,
  11: emptyTileRules,
  12: emptyTileRules,
  14: emptyTileRules,
  17: emptyTileRules,

  1: {
    ...emptyTileRules,
    right: [2],
  },

  2: {
    ...emptyTileRules,
    left: [1],
  },

  3: {
    top: landTop,
    bottom: [13, 16],
    left: [...sky, ...overhangMiddle, ...overhangBottom],
    right: [4, 5, 7, 8, 28],
  },

  4: {
    top: landTop,
    bottom: [...sky, ...9, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    left: [3, 4, 6, 7, 24, 26, 27],
    right: [4, 5, 7, 8, 28],
  },

  5: {
    top: landTop,
    bottom: [15, 18],
    left: [3, 4, 6, 7, 27],
    right: [...sky, ...overhangMiddle, ...overhangBottom],
  },

  6: {
    top: landTop,
    bottom: [13, 16],
    left: [...sky, ...overhangMiddle, ...overhangBottom],
    right: [4, 5, 7, 8, 28],
  },

  7: {
    top: landTop,
    bottom: [...sky, ...9, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    left: [3, 4, 6, 7, 24, 26, 27],
    right: [4, 5, 7, 8, 28],
  },

  8: {
    top: landTop,
    bottom: [15, 18],
    left: [3, 4, 6, 7, 27],
    right: [...sky, ...overhangMiddle, ...overhangBottom],
  },

  9: {
    top: landTop,
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...sky, ...landStart, ...landMiddle, ...landEnd],
    right: [...sky, ...landStart, ...landMiddle, ...landEnd],
  },

  10: {
    top: [...sky, ...landMiddle],
    bottom: [...landStart, ...landMiddle, ...landEnd],
    left: [...sky, 10, ...landEnd],
    right: [...sky, 10, ...landStart],
  },

  13: {
    top: [3, 6, 13],
    bottom: [13, 16],
    left: [...sky, ...landEnd],
    right: [...sky, ...landStart],
  },

  15: {
    top: [5, 8, 15],
    bottom: [15, 18],
    left: [...sky, ...landEnd],
    right: [...sky, ...landStart],
  },

  16: {
    top: [3, 6, 13],
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...sky, ...landEnd],
    right: [...sky, ...landStart],
  },

  18: {
    top: [5, 8, 15],
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...sky, ...landEnd],
    right: [...sky, ...landStart],
  },

  19: {
    top: [...sky, ...landMiddle, ...overhangBottom],
    bottom: [29],
    left: [...sky, ...landEnd],
    right: [...sky, ...landStart],
  },

  20: {
    top: [...sky, ...landStart, ...landMiddle, ...landEnd],
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...sky, ...landEnd, 20, 21, 22, 24, 26],
    right: [...sky, ...landStart, 20, 21, 22, 23, 25],
  },

  21: {
    top: [...sky, ...landStart, ...landMiddle, ...landEnd],
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...sky, ...landEnd, 20, 21, 22, 24, 26],
    right: [...sky, ...landStart, 20, 21, 22, 23, 25],
  },

  22: {
    top: [...sky, ...landStart, ...landMiddle, ...landEnd],
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...sky, ...landEnd, 20, 21, 22, 24, 26],
    right: [...sky, ...landStart, 20, 21, 22, 23, 25],
  },

  23: {
    top: [...sky, ...landStart, ...landMiddle, ...landEnd],
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...landStart, ...landMiddle],
    right: [...landMiddle, ...landEnd],
  },

  24: {
    top: [...sky, ...landMiddle],
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...sky, ...landEnd],
    right: [...landMiddle, ...landEnd],
  },

  25: {
    top: [...sky, ...landMiddle],
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...landStart, ...landMiddle],
    right: [...sky, ...landStart],
  },

  26: {
    top: [...sky, ...landMiddle],
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...sky, ...landEnd],
    right: [...landMiddle, ...landEnd],
  },

  27: {
    top: landTop,
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...sky, ...landEnd],
    right: [...landMiddle, ...landEnd],
  },

  28: {
    top: landTop,
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...landMiddle, ...landEnd],
    right: [...sky, ...landEnd],
  },

  29: {
    top: [19],
    bottom: [...sky, ...landStart, ...landMiddle, ...landEnd],
    left: [...sky, ...landEnd],
    right: [...sky, ...landStart],
  },
};

export const randomize = (width, height) => {
  const anyUnsolved = map => map.some(row => row.some((cell) => !cell.tile));

  const anyImpossible = map => map.some(row => row.some((cell) => !cell.tile && cell.possible.length === 0));

  return emptyMap.map(row => row.map(cell => ({ tile: null, possible: all })))
};
