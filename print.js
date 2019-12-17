const fs = require('fs');

const print = (path) => {
  fs.readFile(path, 'utf-8', (_error, data) => {
    console.log(data);
  })
}

const readFileWithTrim = (filepath, cb) => {
  fs.readFile(filepath, 'utf-8', (_error, data) => {
    cb(null, data.trim());
  })
}

const getFileOwners = (dirpath, cb) => {
  fs.readdir(dirpath, (_error1, filenames) => {
    const readFileStat = (items, result = []) => {
      if (items.length === 0) {
        // Обработку ошибок пока не рассматриваем
        cb(null, result);
        return;
      }
      const [first, ...rest] = items;
      const filepath = path.join(dirpath, first);
      fs.stat(filepath, (_error2, stat) => {
        readFileStat(rest, [...result, { filename: first, owner: stat.uid }]);
      });
    };
    readFileStat(filenames);
  });
};

exports.print = print;
exports.readFileWithTrim = readFileWithTrim;
exports.getFileOwners = getFileOwners;