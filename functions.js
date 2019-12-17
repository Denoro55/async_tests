const fs = require('fs');
const promises = require('fs').promises;
const path = require('path');

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

const compareFileSizes = (filepath1, filepath2, cb) => {
  fs.stat(filepath1, (_error1, { size: size1 }) => {
    fs.stat(filepath2, (_error2, { size: size2 }) => {
      cb(null, Math.sign(size1 - size2));
    });
  });
};

// слежка за изменением файла
const watch = (filepath, period, cb) => {
  let lastTime;
  const interval = setInterval(() => {
    const stats = fs.stat(filepath, (_err, file) => {
      if (_err) {
        clearInterval(interval);
        cb(_err);
        return;
      }
      const currentTime = file.mtimeMs;
      console.log("test with file ", file.size + ' :' + currentTime + ':' + lastTime);
      if (!lastTime) {
        lastTime = currentTime;
        console.log('set new time')
      } else {
        if (currentTime !== lastTime) {
          console.log('+++')
          clearInterval(interval);
          cb(null);
          return;
        }
      }
    })
  }, period);
}

// map(['./files/first.txt', './files/second.txt'], fs.readFile, (err1, results) => {
//   if (err1) {
//     return;
//   }
//   fs.writeFile('./files/new-file.txt', results.join(''), (err2) => {
//     if (err2) {
//       return;
//     }
//     console.log('finished!');
//   });
// });

// аналог с библиотекой async.waterfall
const unionFiles = (inputPath1, inputPath2, outputPath, cb) => {
  waterfall([
    (callback) => fs.readFile(inputPath1, callback),
    (data1, callback) => fs.readFile(inputPath2, (err, data2) => callback(err, data1, data2)),
    (data1, data2, callback) => fs.writeFile(outputPath, `${data1}${data2}`, callback),
  ], cb);
};

const move = (src, dist, cb) => {
  fs.readFile(src, (_err, content) => {
    if (_err) {
      cb(_err);
      return;
    }
    fs.writeFile(dist, content, 'utf-8', (_err2, data) => {
      if (_err2) {
        cb(_err2);
        return;
      }
      fs.unlink(src, (_err3) => {
        if (_err3) {
          cb(_err3);
          return;
        }
        cb(null);
      })
    });
  });
}

// получить размер файлов из директории
const getDirectorySize = (dirpath, cb) => {
  fs.readdir(dirpath, (error1, filenames) => {
    if (error1) {
      cb(error1);
      return;
    }
    const filepaths = filenames.map((name) => path.join(dirpath, name));
    async.map(filepaths, fs.stat, (error2, stats) => {
      if (error2) {
        cb(error2);
        return;
      }
      const sum = _.sumBy(stats.filter((stat) => stat.isFile()), 'size');
      cb(null, sum);
    });
  });
};

// получить размер файлов из директории 2
// const getDirectorySize = (dirpath) => {
//   const promise = fs.readdir(dirpath).then((filenames) => {
//     const filepaths = filenames.map((name) => path.join(dirpath, name));
//     const promises = filepaths.map(fs.stat);
//     return Promise.all(promises);
//   });

//   return promise.then((stats) => _.sumBy(stats.filter((stat) => stat.isFile()), 'size'));
// };

// перевернуть контент в файле
const reverse = (filepath) => fs.readFile(filepath, 'utf-8')
  .then((data) => fs.writeFile(filepath, data.split('\n').reverse().join('\n')));

// создает файла если его не существует
const touch = (filepath) => fs.access(filepath)
  .catch(() => fs.writeFile(filepath));

// просканировать файлы и вернуть в виде массивы их типы либо Null
const getTypeName = (stat) => (stat.isDirectory() ? 'directory' : 'file');

// получить типы файлов из массива
const getTypes = ([firstPath, ...rest]) => {
  const result = [];

  const processPath = (filepath) => promises.stat(filepath)
    .then((data) => {
      result.push(getTypeName(data))
    })
    .catch(() => result.push(null));

  const initPromise = processPath(firstPath);

  const resultPromise = rest.reduce(
    (promise, filepath) => {
      return promise.then(() => processPath(filepath));
    }, initPromise,
  );

  return resultPromise.then(() => result);
};

// promises all
const readFiles = (files) => {
  const allPromises = files.map(filepath => promises.readFile(filepath, 'utf-8').then((e) => ({ status: 'sucess', value: e})));
  const mainPromise = Promise.all(allPromises);
  return mainPromise.then(contents => contents.map(console.log));
}

// копирование
const copy = (src, dest) => {
  return promises.readFile(src, 'utf-8')
    .then(content => promises.writeFile(dest, content));
};

exports.print = print;
exports.readFileWithTrim = readFileWithTrim;
exports.getFileOwners = getFileOwners;
exports.compareFileSizes = compareFileSizes;
exports.move = move;
exports.getDirectorySize = getDirectorySize;
exports.getTypes = getTypes;
exports.readFiles = readFiles;