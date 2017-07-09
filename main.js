const app = require('./index.js')


app.listen(80)
app.page({'/': __dirname + '/page/view/index.html'})

app.view('/', {
    lang: 'zh',
    title: 'MobileGameFramework',
})

app.view('/video', 'hrllp', 'post')