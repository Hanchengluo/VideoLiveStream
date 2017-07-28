'use strict'

const Module = require('./module/module.js')
const configWrite = require('./configWrite.js')
const configuration = require('./configuration.js')
const router = require('./router/root.js')
const MongoDB = require('mongodb')
const express = require('express')
const bodyParser = require('body-parser')
const SocketIo = require('socket.io').listen(configuration.websocket.port)
const app = express()


// 全局变量
global.INDEXPATH = __dirname
global.CONFIGURATION = configuration


// 初始化配置
configWrite.appcache()
configWrite.nginx()


// 解析中间件绑定
// 文件资源
// 静态资源
// 版本控制
// 路由中间件
// 绑定端口
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(configuration.storage.path, express.static(`${__dirname}${configuration.storage.path}`))
app.use('/public', express.static(`${__dirname}/page/public`))
app.use('/appcache', express.static(`${__dirname}/page/appcache`))
app.use('/', router)
app.listen(configuration.express.port)


// WebSocket连接
SocketIo.sockets.on('connection', (socket) => {
    
})


// 连接数据库
MongoDB.MongoClient.connect(configuration.mongodb.path, (Error, mongodb)=>{
    global.SQL = new Object()
    if(Error){
        console.error(Error)
    }else{
        // 连接表
        for(let i of configuration.mongodb.collection){
            global.SQL[i] = mongodb.collection(i)
        }
    }
})