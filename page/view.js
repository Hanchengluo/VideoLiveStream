const fs = require('fs')


module.exports = (page, callback) => {
    let name = Object.keys(page)
    let sum = 0
    let obj = new Object
    for(let i of name){
        try{
            fs.readFile(page[i], (Error, data) => {
                obj[i] = new Function('data', 'return `' + data.toString() + '`')
                if(sum == name.length-1){
                    callback(obj)
                }
                sum += 1
            })
        }catch(err){
            console.log(err)
        }
    }
}