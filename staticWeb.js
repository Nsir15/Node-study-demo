let http = require('http'),
    path = require('path'),
    url = require('url'),
    mime = require('mime'),
    {_readFile} = require('./utils/promiseFs');

let handle = function(req,res){
    let {pathname,query} = url.parse(req.url,true),
        pathReg = /\.([a-z0-9]+)$/i,
        suffix = pathReg.test(pathname) ? pathReg.exec(pathname)[1] : null,
        encodeReg = /(JPG|JPEG|PNG|GIF|SVG|ICO|BMP|EOT|TTF|WOFF|MP3|MP4|OGG|WAV|M4A|WMV|AVI)$/i,
        encoding = encodeReg.test(suffix) ? ':charset=utf-8':'';
    
    if(suffix){ // 请求静态资源
        pathname = path.resolve('./static') + pathname;
       _readFile(pathname).then(result => {

         res.writeHead(200, {
           'content-type': `${mime.getType(suffix)}${encoding}`
         })
         res.end(result)
       }).catch(error => {
         res.writeHead(404,{
           'content-type':'application/json;charset=utf-8;'
         })
         res.end(JSON.stringify(error))
       })

    }else{ // 请求API

    }
};
let port = 8081;
http.createServer(handle).listen(port,()=>{
  console.log('server is success');
})