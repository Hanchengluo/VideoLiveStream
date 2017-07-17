'use strict'

const Module = require('./module/module.js')
const configuration = require('./configuration.js')
const router = require('./router/root.js')
const express = require('express')
const bodyParser = require('body-parser')
const Websocket = require('socket.io').listen(configuration.websocket.port)
const app = express()


// 全局变量
global.INDEXPATH = __dirname
global.CONFIGURATION = configuration


// 初始化appcache
// 连接数据库
Module.appcache()
Module.mongodb()


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
Websocket.sockets.on('connection', (socket) => {
    
})