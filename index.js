const express = require('express')
const MongoDB = require('mongodb')
const cluster = require('cluster')
const bodyParser = require('body-parser')
const Websocket = require('socket.io')
const os = require('os')
const fs = require('fs')
const app = express()


const map = [1,2,3,4,5,6,7,8,9,0,'a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','k','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z']


exports.listen = function(port){
    app.listen(port)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true}))
    app.use(express.static(`${__dirname}/module`))
}


exports.page = function(page){
    let name = Object.keys(page)
    let sum = 0
    let obj = new Object
    for(let i of name){
        try{
            fs.readFile(page[i], function(Error, data){
                obj[i] = new Function('data', 'return `' + data.toString() + '`')
                if(sum == name.length-1){
                    global.Module = obj
                }
                sum += 1
            })
        }catch(err){
            console.log(err)
        }
    }
}


app.get('/test', function(req, res){
    res.cookie('SocketId', (
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + '-' + 
            Math.round(Math.random()*10) + 
            Math.round(Math.random()*10) + 
            Math.round(Math.random()*10) + 
            Math.round(Math.random()*10)
        ), {path: '/'})
    res.sendFile( __dirname + '/page/view/index.html')
})


exports.view = function(name, value, Method){
    app[Method != undefined ? Method : 'get'](name, function(req, res){
        res.cookie('SocketId', (
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + 
            map[Math.round(Math.random()*60)] + '-' + 
            Math.round(Math.random()*10) + 
            Math.round(Math.random()*10) + 
            Math.round(Math.random()*10) + 
            Math.round(Math.random()*10)
        ), {path: '/'})
        res.send(Module[name] != undefined ? Module[name](value) : value)
    })
}