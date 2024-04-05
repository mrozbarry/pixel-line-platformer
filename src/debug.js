window.debug = window.debug || ((...desc) => (v) => {
  console.info('[DEBUG]', ...desc, v);
  return v;
});
