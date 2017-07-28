'use strict'

// 组件模块  
// 定义所有的公共方法和组件

const configuration = require('../configuration.js')
const crypto = require('crypto')
const multer = require('multer')
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
    let key = typeof text === 'string' ? text : text.toString()
    let head = (`${configuration.crypto.salt}:${(new Array(3).join(0) + key.length.toString()).slice(-3)}${key}`)
    let crypted = cipher.update(`${head}${crypto.createHash('md5').update(head).digest('hex')}`, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}


// 解密
exports.encrypt = (text) => {
    let decipher = crypto.createDecipher(configuration.crypto.crypto, configuration.crypto.key)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    let salt = dec.startsWith(configuration.crypto.salt)
    let key = dec.substring(configuration.crypto.salt.length + 4, configuration.crypto.salt.length + 4 + Number(dec.substring(configuration.crypto.salt.length + 1, configuration.crypto.salt.length + 4)))
    return salt ? key : false
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