export const union = (...arrays) => {
  const all = arrays.filter(Array.isArray).reduce((total, array) => [...total, ...array], []);
  return Array.from(new Set(
    all.filter(v => arrays.every(a => a.includes(v)))
  ));
};

export const randomItem = array => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

