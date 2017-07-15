'use strict'

// 路由模块  
// 定义所有的路由

const Module = require('../module/module.js')
const express = require('express')
const router = express.Router()
const ffmpeg = require('fluent-ffmpeg')

// 暴露出路由
module.exports = router




// 该路由使用的中间件
// 所有请求都会从这里执行
router.use(function(req, res, next){
    res.append('Framework', 'Node.JS')
    res.append('Company', 'XIVI Studios')
    next()
})


// 定义网站主页的路由
router.get('/', (req, res) => {
    if(req.query.stream){
        res.cookie('UserTokin', Module.string12bit(), {path: '/'})
        res.sendFile(`${INDEXPATH}/page/html/index.html`)
    }else{
        res.location('/')
    }
})


// 获取直播流地址
router.get('/LiveStreamPath', (req, res) => {
    if(req.query.stream){
        res.send({Status:200})
    }else{
        res.send({Status:404})
    }
})


// 文件上传
router.post('/uploadFile', (req, res) => {
    Module.upLoad(req, res, (Error) => {
        Error && console.log(Error)
    })
})