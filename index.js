const express = require('express')
const MongoDB = require('mongodb')
const cluster = require('cluster')
const bodyParser = require('body-parser')
const Websocket = require('socket.io')
const os = require('os')


const view = require('./page/view.js')
const app = express()


let Module = new Object()


Websocket.listen(88)
app.listen(80)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


view({index: __dirname + '/page/view/index.html'}, (data)=>{
    Module = data
})


// index
app.get('/', (req, res)=>{
    res.send(Module.index({
        lang: 'zh',
        title: 'hello',
        head: `<link rel="stylesheet" href="css/awesome/css/font-awesome.min.css"/>
        <link rel="stylesheet" href="css/style.css"/>
        <script src="js/jquery.js"></script>
        <script src="js/index.js"></script>`
    }))
})