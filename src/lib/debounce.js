export const debounce = (fn, delay) => {
  let handle = null;
  return (...params) => {
    clearTimeout(handle);
    handle = setTimeout(() => fn(...params), delay);
  };
};
