window.onload = () => {
    
    
    // 初始化Vue
    Module = new Vue(new function(){
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
            // 用户
            User:{
                'opacity':0,
                'z-index': -100
            },
            // 登录
            Login:{
                'opacity':1
            },
            // 通知
            NotificationTab:{
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
            }
        }
    })
    
    
}