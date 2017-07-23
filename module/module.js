'use strict'

// 组件模块  
// 定义所有的公共方法和组件

const configuration = require('../configuration.js')
const crypto = require('crypto')
const multer = require('multer')
const MongoDB = require('mongodb')
const fs = require('fs')
const os = require('os')


// module自有变量
// 字典
const map = [
    1,2,3,4,5,6,7,8,9,0, 'a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','k','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z'
]


// 加密
exports.decrypt = (text) => {
    let cipher = crypto.createCipher(configuration.crypto.crypto, configuration.crypto.key)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}


// 解密
exports.encrypt = (text) => {
    let decipher = crypto.createDecipher(configuration.crypto.crypto, configuration.crypto.key)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
}


// 文件上传
// 初始化diskStorage存储引擎
exports.upload = multer({
    storage: multer.diskStorage({
        destination:(req, file, callback) => callback && callback(null, `${configuration.storage.path}/${req.query.id}/${req.query.type}`),
        filename: (req, file, callback) => callback && callback(null, req.query.name)
    })
}).single('files')


// 12位随机字符串
exports.string12bit = () => {
    return map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)] + map[Math.round(Math.random()*60)]
}


// 更新应用缓存
exports.appcache = () => {
    // 读取配置
    fs.readFile(INDEXPATH + '/appcache.json', (Error, data)=>{
        if(Error){
            console.log(Error)
        }else{
            let config = JSON.parse(data.toString())
            let appcache = new String()
            appcache += 'CACHE MANIFEST' + os.EOL + `# ${config.TIME}  ${config.AUTHO}` + os.EOL  // 维护信息
            // 是否开启工厂模式
            if(configuration.project == true){
                appcache += `# ${Date.now()}` + os.EOL
            }
            for(let i of config.CACHEMANIFEST){
                appcache += i + os.EOL
            }
            appcache += os.EOL + 'NETWORK:' + os.EOL
            if(config.NETWORK.length == 0){
                appcache += '*' + os.EOL
            }else{
                for(let i of config.NETWORK){
                    appcache += i + os.EOL
                }
            }
            appcache += os.EOL + 'FALLBACK:' + os.EOL
            let FALLBACK = Object.keys(config.FALLBACK)
            if(FALLBACK.length != 0){
                for(let i of FALLBACK){
                    appcache += `${FALLBACK} ${config.FALLBACK[FALLBACK]}` + os.EOL
                }
            }
            // 更新文件
            fs.writeFile(INDEXPATH + '/page/appcache/package.appcache', appcache, 'utf8', (err)=>{
                if(Error){
                    console.log(Error)
                }
            })
        }
    })
}


// 连接数据库
exports.mongodb = () => {
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
}