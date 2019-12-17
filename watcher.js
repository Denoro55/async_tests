export default (filepath, period, cb) => {
  let lastCheckTime = Date.now();

  const check = (timerId) => {
    fs.stat(filepath, (err, stats) => {
      if (err) {
        clearInterval(timerId);
        cb(err);
        return;
      }
      console.log(stats.mtimeMs + ' and ' + lastCheckTime)
      if (stats.mtimeMs >= lastCheckTime) {
        cb(null);
      }
      lastCheckTime = Date.now();
    });
  };

  const timerId = setInterval(() => check(timerId), period);
  return timerId;
};