let path = require('path'),
    fs = require('fs'),
    fsObject = {};

// 判断后缀是否是非文本
let suffixHandle = function(pathname){
  let suffixReg = /\.([0-9a-zA-Z]+)/i,
      suffix = suffixReg.test(pathname) ? suffixReg.exec(pathname)[1] : '',
      encoding = null;
  !/(JPG|JPEG|PNG|GIF|SVG|ICO|BMP|EOT|TTF|WOFF|MP3|MP4|OGG|WAV|M4A|WMV|AVI)$/i.test(suffix) ? encoding = 'utf8' : null
  return encoding;
};

// readFile mkdir  readdir  rmdir unlink 
// ['readFile','mkdir','readdir','rmdir','unlink'].forEach(item=>{

//   fsObject['_'+item] = function(pathname){
//       // 处理路径
//     pathname = path.resolve(pathname)

//     return new Promise((resolve, reject )=>{
//       let encoding = suffixHandle(pathname),
//           callback = (err,res)=>{
//           if(err){
//             reject(err)
//             return
//           }
//           resolve(res || '')
//         };
     
//         // 如果不是readFile 只需要两个参数，没必要传encoding
//         if(item !== 'readFile'){
//           encoding = callback;
//           callback = null;
//         }  

//       fs[item](pathname,encoding,callback)
//     })
//   }
// });

// 处理 writeFile ,appendFile

['writeFile','appendFile'].forEach(item=>{
  fsObject['_'+item] = function anonymous(pathname,data){
    pathname = path.resolve(pathname);
    return new Promise((resolve,reject)=>{
      let callback = (err,res)=>{
        if(err){
          reject(err)
          return 
        }
        resolve(res || '')
      };
      fs[item](pathname,data,callback)
    })
  }
});

// fsObject['_copyFile'] = function anonymous(src,dest){
//   src = path.resolve(src);
//   dest = path.resolve(dest);
//   return new Promise((resolve,reject)=>{
//     let callback = (err,res)=>{
//       if(err){
//         reject(err)
//         return ;
//       }
//       resolve(res || '')
//     };

//     fs.copyFile(src,dest,callback)
//   })
// };



// 将copyFile,readFile一组放在一块处理的方式

['readFile','readdir','mkdir','rmdir','copyFile','unlink'].forEach(item=>{

  fsObject['_'+item] = function anonymous(pathname,dest = ''){

    // 处理路径
    pathname = path.resolve(pathname);
    dest = path.resolve(dest);
    return new Promise((resolve, reject) => {

      let callback = (err,res)=>{
        if(err){
          reject(err)
          return 
        }
        resolve(res || '')
      };

      let args  = [callback];
      if(item === 'readFile'){
        if (!/(JPG|JPEG|PNG|GIF|SVG|ICO|BMP|EOT|TTF|WOFF|MP3|MP4|OGG|WAV|M4A|WMV|AVI)$/i.test(pathname)){
          args.unshift('utf8')
        }
      }else if(item === 'copyFile'){
        args.unshift(dest)
      }
      fs[item](pathname,...args)
    })
  }
})

module.exports = fsObject;


