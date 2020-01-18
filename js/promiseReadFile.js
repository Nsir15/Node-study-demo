let path = require('path'),
    fs = require('fs');

let _readFile = function(pathname){

  // TODO:这里需要做两件事：
  // 1.对路径进行处理，为了防止路径太乱，一般以当前项目的根目录为依托，后面调用的时候只需要传递相对于项目根目录的相对路径就可以。程序会自动生成完整的绝对路径地址
  // 2.如果是富文本资源之类的，encoding不能是utf8，使用默认的，也可以设置buffer，但是感觉这样太绝对，默认的不一定都是buffer，可能会有其他的

  let rootDir = path.resolve();
  pathname = path.resolve(rootDir, pathname)

  // 获取后缀
  let encoding ;
  let suffix = null;
  let suffixReg = /\.([0-9a-zA-Z]+)$/i;
  // 先验证有没有后缀
  suffixReg.test(pathname) ? suffix = suffixReg.exec(pathname)[1] : null;
  // 判断是不是非文本
  if (!/(jpg|jpeg|png|webp|gif|svg|ico|bmp|ttf|mp3|mp4|wmv|avi|mpeg|wav|m4a)/i.test(suffix)) {
    encoding = 'utf8'
  }

  return new Promise((resolve,reject)=>{

    let callback = (err,res)=>{
      if(err){
        reject(err)
        return
      }
      resolve(res || '')
    };
    
    fs.readFile(pathname, encoding, callback)
  })
}

module.exports = {
  _readFile
}

