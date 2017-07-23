window.onload = () => {
    
    
    // 初始化Vue
    let Module = new Vue(new function(){
        // 组件节点
        this.el = '#docker'
        // 组件参数
        this.data = {
            // 加载动画
            Animated: true,
            fadeInDown: true,
            // 菜单控制
            MenuTips:false,
            // 通知
            Notification:false,
            // 用户信息
            MenuUser: false,
            // 用户
            User:{
                'opacity':0,
                'z-index': -100
            },
            // 登录
            Login:{
                'opacity': 1,
                'z-index': 1
            },
            // 通知
            NotificationStyle:{
                'opacity':0,
                'z-index': -100
            },
            // 搜索
            search:{
                'right':'120px'
            },
            // 中心区
            index:{
                'height': document.documentElement.clientHeight - 90 + 'px',
            }
        }
        // 绑定事件
        this.methods = {
            // 切换通知
            NotificationTab: () => {
                Module.Notification = (Module.Notification == false) ? true : false
                Module.MenuTips = false
                Module.MenuUser = false
            },
            // 用户信息
            HeadUserTab: () => {
                Module.MenuUser = (Module.MenuUser == false) ? true : false
                Module.MenuTips = false
                Module.Notification = false
            },
            // 推出登录
            QuitLogin: () => {
                localStorage.removeItem('UserName')
                localStorage.removeItem('PassWord')
                document.cookie = ''
                document.location.reload(true)
            },
        }
    })
    
    
    // 判断是否已经登录
    if(localStorage.UserName != undefined && localStorage.PassWord != undefined){
        $.post('./Login', {
            name: localStorage.UserName,
            pass: localStorage.PassWord,
            decrypt: true
        }, (data) => {
            if(data.code == 200){
                Module.NotificationStyle.opacity = 1
                Module.NotificationStyle["z-index"] = 1
                Module.User.opacity = 1
                Module.User["z-index"] = 1
                Module.Login.opacity = 0
                Module.Login["z-index"] = '-100'
                Module.search.right = '180px'
            }
        })
    }
    
    
    // 登录
    $('#Login').click(() => location.href = (location.href = `${location.origin}/Login`))
    
    
}
