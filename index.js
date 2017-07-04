const express = require('express')
const app = express()
const MongoDB = require('mongodb')
const cluster = require('cluster')
const bodyParser = require('body-parser')
const tools = require('./tools.js')
const upLoad = tools.upload.single('files')
const fs = require('fs')
const os = require('os')


// 全局变量
global.Index = new Object()


// 读取配置文件
fs.read('./config.json', (Error, data) => {
    if(Error){
        
        // 读取配置文件出错
        console.error('初始化失败，读取配置文件出现错误', Error)
        
    }else{
        
        
        const Websocket = require('socket.io').listen(100)
        // HTTP服务器初始化
        // express初始化
        app.listen(88)
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use('/storage', express.static(`${__dirname}/storage`))
        app.use(express.static(`${__dirname}/www/public`))
        
        

        
    }
}

