// 项目配置

'use strict'

module.exports = {
    project:true,  // 开启关闭工厂模式
    express:{
       port:80     // express绑定端口
    },
    mongodb:{
        path:"mongodb://localhost:3306/HomePage",   // mongodb链接
        collection:["User", "Storage"]              // mongodb表
    },
    websocket:{
        port:86    // websocket绑定端口
    },
    storage:{
       path:"/Storage"   // 文件存储目录
    },
    crypto:{
        "crypto":"aes-256-ctr",         // 加密方式
        "key":"799497ode8cm45571387"    // 加密解密主密钥
    }
}
