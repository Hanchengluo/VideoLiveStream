'use strict'

// 路由模块  
// 定义所有的路由

const Module = require('../module/module.js')
const express = require('express')
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
    if(req.cookies){
        let username = req.cookies.username
        let password = req.cookies.password
        SQL.User.find({id:username, key: password}).toArray(function(err, docs){
            if(err){
                console.log(err)
            }
            console.log(docs)
            if(docs.length == 1){
                res.cookie('username', username, {path: '/'})
                res.cookie('password', password, {path: '/'})
                res.sendFile(`${INDEXPATH}/page/html/index.html`)
            }else{
                res.redirect('/Login')
            }
        })
    }else{
        res.redirect('/Login')
    }
})


// 注册页面
router.get('/Sogin', (req, res) => {
    res.sendFile(`${INDEXPATH}/page/html/sogin.html`)
})


// 登录页面
router.get('/Login', (req, res) => {
    res.sendFile(`${INDEXPATH}/page/html/login.html`)
})


// 登录
router.post('/Login', (req, res) => {
    let username = req.body.name
    let password = req.body.pass
    SQL.User.find({id:username, key:password}).toArray(function(err, docs){
        if(err){
            console.log(err)
        }
        if(docs.length == 1){
            res.cookie('username', username, {path: '/'})
            res.cookie('password', password, {path: '/'})
            res.send({code:200})
        }else{
            res.send({code:404})
        }
    })
})


// 注册
router.post('/Sogin', (req, res) => {
    let username = req.body.name
    let password = req.body.pass
    SQL.User.find({id:username}).toArray(function(err, docs){
        if(err){
            console.log(err)
        }
        if(docs.length == 1){
            res.send({code:404})
        }else{
            SQL.User.insertMany([{
                id:username,
                key:password
            }], function(err, result){
                if(err){
                    console.log(err)
                }else{
                    res.cookie('username', username, {path: '/'})
                    res.cookie('password', password, {path: '/'})
                    res.send({code:200})
                }
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
    if(req.query.id){
        res.sendFile(`${INDEXPATH}/page/public/media/stream/${req.query.id}`)
    }else{
        res.status(404).end()
    }
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
