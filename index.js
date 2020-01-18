// let {_readFile} = require('./js/promiseReadFile')

// _readFile('js/promiseReadFile.js').then(result=>{
//   console.log(result);
// }).catch(err=>{
//   console.log(err);
  
// })

let fs = require('fs')
let {
  _readFile,
  _readdir,
  _mkdir,
  _rmdir,
  _unlink,
  _writeFile,
  _appendFile,
  _copyFile
}  = require('./utils/promiseFs');

// _readFile('js/promiseReadFile.js').then(res=>console.log(res)).catch(err=>console.log(err))
// _readdir('./').then(res=>console.log(res))
// _unlink('b.js').catch(err=>console.log(err))

let arr = [{
  name: 'wang',
  age: 18
}, {
  name: 'wang',
  age: 18
}, {
  name: 'wang',
  age: 18
}];

// fs.writeFile('./a.js',arr,()=>{
//   console.log('writeFile');
// });

// _writeFile('a.js',arr).then(res => console.log(res)).catch(err => console.log(err));
_readFile('./json/USER.JSON').then(res => {
  res = JSON.parse(res)
  console.log(res.length);
  
  console.log(res[res.length - 1]['id']);
    console.log(typeof res[res.length - 1].id);
    console.log(parseInt(res[res.length - 1].id)+1);
    

}).catch(err => console.log(err));

// _appendFile('a.js','\nvar b = 333').catch(err=>console.log(err))
// _copyFile('a.js','b.js').then(()=>{
//   console.log('拷贝成功');
// })
// _writeFile('http.js').then(res=>console.log(res)).catch(err=>console.log(err))
