const app = require('./index.js')


app.listen(80)
app.page({'/': __dirname + '/page/view/index.html'})

app.view('/', {
    lang: 'zh',
    title: 'hello',
    head: `<link rel="stylesheet" href="css/awesome/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="css/style.css"/>
    <script src="js/jquery.js"></script>
    <script src="js/index.js"></script>`
})

app.view('/video', 'hrllp', 'post')