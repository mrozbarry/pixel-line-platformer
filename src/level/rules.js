export const all = [0, 1, 2, 9];

export const connectors = {
  0: {
    id: 'empty0',
    t: [...all],
    b: [...all],
    l: [0, 2],
    r: [0, 1],
  },

  1: {
    id: 'cloud-left',
    t: [...all],
    b: [...all],
    l: [0, 2],
    r: [2],
  },

  2: {
    id: 'cloud-right',
    t: [...all],
    b: [...all],
    l: [1],
    r: [0, 2],
  },
  
  9: {
    id: 'platform-small',
    t: [...all],
    b: [...all],
    l: [0, 2],
    r: [0, 1],
  },
};


