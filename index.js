const fs = require('fs');
const promises = require('fs').promises;
const map = require('async').map;

// functions
const print = require('./functions').print;
const readFileWithTrim = require('./functions').readFileWithTrim;
const getFileOwners = require('./functions').getFileOwners;
const getTypes = require('./functions').getTypes;
const readFiles = require('./functions').readFiles;

// variables
const filepath = 'files/doc.txt';

getTypes(['files', 'index.js', 'undefined']).then(console.log);

// fs.readFile('./newfile.txt', 'utf-8', (err, data) => {
//   console.log(data);
// })

// const readFile = (path, cb) => {
//   fs.readFile(path, 'utf-8', (err, data) => {
//     cb(data);
//   })
// }

// readFile('./newfile.txt', (data) => console.log(data));

// const readFile = (path, cb) => {
//   return promises.readFile(path, 'utf-8')
// }

// readFile('./newfil.txt').then(console.log).catch(e => console.log(e)).then(() => promises.readFile('index.js', 'utf-8')).then(console.log);

readFiles(['./newfile.txt', './files/first.txt']).then(() => console.log('all files have been read'))

// print(filepath);

// readFileWithTrim(filepath, (_error, data) => console.log(data));

// getFileOwners('files', (_error, data) => console.log(data));

// watch('./index.js', 500, (err) => {
//   console.log('changed');
// })

// promises.readFile('./files/first.txt', 'utf-8').then("go next").then(() => 2).then(console.log);

// copy('./files/first.txt', './newfile.txt').then(() => console.log('end'));

// promises.readFile('./files/undefined.txt').catch(() => console.log('error'));

// const readFile = (filepath) => {
//   return promises.readFile(filepath);
// }

// readFile('./files/undefined.txt').catch(e => console.log(e)).then(() => console.log('hello world hahaha'))