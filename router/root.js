'use strict'

// 路由模块  
// 定义所有的路由

const Module = require('../module/module.js')
const express = require('express')
const fs = require('fs')
const router = express.Router()


// 该路由使用的中间件
// 所有请求都会从这里执行
router.use(function(req, res, next){
    res.append('Framework', 'Node.JS')
    res.append('Company', 'XIVI Studios')
    next()
})


// 定义网站主页的路由
router.get('/', (req, res) => {
    res.sendFile(`${INDEXPATH}/page/html/index.html`)
})


// 视频页面
router.get('/Video', (req, res) => {
    res.sendFile(`${INDEXPATH}/page/html/video.html`)
})


// 登录注册页面
router.get('/Login', (req, res) => {
    res.sendFile(`${INDEXPATH}/page/html/login.html`)
})


// 登录
router.post('/Login', (req, res) => {
    let key = req.body.decrypt == 'true' ? Module.encrypt(req.body.pass) : req.body.pass
    SQL.User.findOne({id:req.body.name, key:key}, (err, docs) => {
        err && console.log(err)
        if(docs){
            res.cookie('username', req.body.name, {path: '/'})
            res.cookie('password', Module.decrypt(key), {path: '/'})
            delete docs._id
            docs.key = Module.decrypt(key)
            res.send({code:200, data:docs})
        }else{
            res.send({code:404})
        }
    })
})


// 注册
router.post('/Sogin', (req, res) => {
    SQL.User.findOne({id:req.body.name}, (err, docs) => {
        err && console.log(err)
        if(docs){
            res.send({code:404})
        }else{
            SQL.User.insertMany([{id:req.body.name, key:req.body.pass}], (err, result) => {
                err && console.log(err)
                res.send({code:200})
            })
        }
    })
})


// 获取弹幕
router.get('/Subtitles', (req, res) => {
    res.send({
        '10':{time:10, text:'这是一个测试弹幕'},
        '20':{time:20, text:'这是一个测试弹幕'},
        '30':{time:30, text:'这是一个测试弹幕'},
    })
})


// 获取视频
router.get('/VideoFile', (req, res) => {
    fs.readFile(`${INDEXPATH}/page/public/media/stream/Video.mp4`, (err, data) => res.send(data))
})


// 获取字幕
router.get('/Track', (req, res) => {
    if(req.query.id){
        res.sendFile(`${INDEXPATH}/page/public/media/stream/${req.query.id}.vtt`)
    }else{
        res.status(404).end()
    }
})


// 文件上传
router.post('/uploadFile', (req, res) => {
    Module.upLoad(req, res, (Error) => {
        Error && console.log(Error)
    })
})


// 暴露出路由
module.exports = router
