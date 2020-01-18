let http = require('http'),
    path = require('path'),
    url = require('url'),
    mime = require('mime'),
    {_readFile,_writeFile} = require('../utils/promiseFs');

// 公共方法
let readVote = function () {
  return _readFile('../json/VOTE.JSON').then(res => {    
    return JSON.parse(res)
  }); // 返回的是promise
};

let readUser = function(){
  return _readFile('../json/USER.JSON').then(res=>JSON.parse(res));
};

let handleResponse = function(res,returnObj){
  res.writeHead(200,{
    'content-type':'application/json;charset=utf-8;'
  });
  res.end(JSON.stringify(returnObj))
};

let handle = function(req,res){

  // 设置允许所有域名跨域请求
    res.setHeader('access-control-allow-origin', '*');

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
      if(pathname === '/getUser' && reqMethod === 'GET'){
        let {id = 0} = query,
            returnObj = {code: -1, message: 'error',data: null};
        readVote().then(result=>{          
          let data = result.find(item => {            
            return parseInt(item.id) === parseInt(id)
          });

          if(data){
              returnObj = {code: 0, message: 'success',data}
              handleResponse(res,returnObj)
              return ;
          }
          // 没有数据，需要触发catch方法
          throw new Error('')   
        }).catch(err=> handleResponse(res,returnObj))
        return ;
      };

      console.log('pathname---'+pathname+'reqMethod----'+reqMethod);
      
      if(pathname === '/register' && reqMethod === 'POST'){

        /**服务端接收post请求参数的流程
         * （1）给req请求注册接收数据data事件（该方法会执行多次，需要我们手动累加二进制数据）
         *      * 如果表单数据量越多，则发送的次数越多，如果比较少，可能一次就发过来了
         *      * 所以接收表单数据的时候，需要通过监听 req 对象的 data 事件来取数据
         *      * 也就是说，每当收到一段表单提交过来的数据，req 的 data 事件就会被触发一次，同时通过回调函数可以拿到该 段 的数据
         * （2）给req请求注册完成接收数据end事件（所有数据接收完成会执行一次该方法）
         */
        // 原文链接： https: //blog.csdn.net/u013263917/article/details/78682270

        var data = '';
        // 注册data事件，接收数据。每当收到一段表单提交的数据，该方法执行一次
        req.on('data',function(chunk){
          // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
          data += chunk;          
        });
        //注册end事件，所有数据接收完成会执行一次该方法
        req.on('end',function(){
          console.log('end---'+data);
          // 对url进行解码（ url会对中文进行编码）
          data = decodeURI(data)
          // post请求参数不能使用url模块解析，因为他不是一个url，而是一个请求体对象

          let obj = {}
          data.split('&').forEach(item=>{
            obj[item.split('=')[0]] = item.split('=')[1]
          });
          // 虽然客户端是密码传输的是密文，但是为了安全起见，服务器会进行二次处理
          // 这里处理规则是前后各去掉两位，将顺序逆转
          obj.password = obj.password.slice(4,-4).split('').reverse().join('');
          let newUser = {
            "id": 0,
            "picture": "img/woman.png",
            "phone": "",
            "bio": "The  test of courage on earth is to bear defeat without losing heart",
            "time": new Date().getTime(),
            "isMatch": 0,
            "matchId": "0",
            "slogan": "",
            "voteNum": 0,
            ...obj
          };
          readUser().then(result=>{
            newUser.id = result.length <=0 ? 0 : parseInt(result[result.length - 1].id)+1;             
            result.push(newUser);            
            return _writeFile('../json/USER.JSON',result);
          }).then(result=>{
            handleResponse(res, {
              code: 200,
              message: 'success'
            })
          }).catch(error=>{
            handleResponse(res, {
              code: -1,
              message: 'error',
              error
            })
          });

        });
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