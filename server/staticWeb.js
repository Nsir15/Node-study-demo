let http = require('http'),
    path = require('path'),
    url = require('url'),
    mime = require('mime'),
    {_readFile} = require('../utils/promiseFs');

let handle = function(req,res){
    let {pathname,query} = url.parse(req.url,true),
        pathReg = /\.([a-z0-9]+)$/i,
        suffix = pathReg.test(pathname) ? pathReg.exec(pathname)[1] : null,
        encodeReg = /(JPG|JPEG|PNG|GIF|SVG|ICO|BMP|EOT|TTF|WOFF|MP3|MP4|OGG|WAV|M4A|WMV|AVI)$/i,
        // 富媒体资源就不加编码格式了
        encoding = !encodeReg.test(suffix) ? 'charset=utf-8':null;
        
    if(suffix){ // 请求静态资源
        pathname = path.resolve('../static') + pathname;
        
       _readFile(pathname).then(result => {          
         res.writeHead(200, {
           'content-type': `${mime.getType(suffix)};${encoding}`
         })
         res.end(result)
       }).catch(error => {
         res.writeHead(404,{
           'content-type':'application/json;charset=utf-8;'
         })
         res.end(JSON.stringify(error))
       })

      //  就不往下进行了
       return ;
    }else{ // 请求API

      let reqMethod = req.method;

      console.log(pathname);
      console.log(reqMethod);
      
      
      if(pathname === '/getUser' && reqMethod === 'GET'){

        let {id = 0} = query,
            returnObj = {code: -1, message: 'error',data: null};

        _readFile('../json/VOTE.JSON').then(result=>{
          // console.log(typeof result);  // string
          result = JSON.parse(result)
          let data = result.find(item => {
            console.log(item);
            
            return parseInt(item.id) === parseInt(id)
          });

          if(data){
              res.writeHead(200, {
                'content-type': 'application/json;charset=utf-8;'
              })
              returnObj = {code: 0, message: 'success',data}
              res.end(JSON.stringify(returnObj))
              return ;
          }
        
          // 没有数据，需要触发catch方法
          throw new Error('')
          
        }).catch(err=>{
          res.writeHead(404, {
            'content-type': 'application/json;charset=utf-8;'
          })
          res.end(JSON.stringify(returnObj))
        })
        return ;
      }

      if(pathname === '/register' && reqMethod === 'POST'){

        return ;
      }
    }

    console.log('end--------');
    
    // 如果既不是静态资源请求，也没找到存在的接口地址，直接返回404
    res.writeHead('404');
    res.end('');
};

let port = 8081;
http.createServer(handle).listen(port,()=>{
  console.log('server is success');
})