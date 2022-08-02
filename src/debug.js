window.debug = window.debug || ((...desc) => (v) => {
  console.log(...desc, v);
  return v;
});
