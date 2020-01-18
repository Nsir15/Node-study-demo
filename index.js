// let {_readFile} = require('./js/promiseReadFile')

// _readFile('js/promiseReadFile.js').then(result=>{
//   console.log(result);
// }).catch(err=>{
//   console.log(err);
  
// })


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
// _writeFile('a.js','var a = 111\nvar test = "test"').then(res=>console.log(res)).catch(err=>console.log(err))
// _appendFile('a.js','\nvar b = 333').catch(err=>console.log(err))
// _copyFile('a.js','b.js').then(()=>{
//   console.log('拷贝成功');
// })
// _writeFile('http.js').then(res=>console.log(res)).catch(err=>console.log(err))
