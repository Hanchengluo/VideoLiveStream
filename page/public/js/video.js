/*!
 * Live Stream Framework -https://github.com/xivistudios/MobileGame
 * Version - 0.1
 * Licensed under the README license - https://github.com/xivistudios/MobileGame/blob/master/README.md
 *
 * Copyright (c) 2017 XIVI Studios - Mr.Panda
 */


window.onload = () => {
    
    
    // 全局函数
    let AspectRatio = (document.documentElement.clientWidth > 1000) ? 0.7 : 0.5 // 屏幕比率
    let VideoLoad = false // 视频是否加载完成
    let FullScreenType = false // 是否全屏
    let Module = new Object() // vue组件
    window.MediaSource = window.MediaSource || window.WebKitMediaSource
    localStorage.referer = location.href
    
    
    // 弹幕管道
    const StreamSubtitles = new function(){
        // 弹幕使用管道填充模式
        this.play = 0 // 保存播放时间
        this.data = new Object() // 保存弹幕对象
        this.length = Math.ceil((document.documentElement.clientHeight * AspectRatio - 150) / 20)
        // 保存管道信息
        this.stream = []
        for(let i = 0; i < this.length; i ++){
            this.stream.push({type:true, top: i * 20 + 20})
        }
        // 用于变更管道可写状态
        this.StreamTime = (i) => setTimeout(() => (StreamSubtitles.stream[i].type = true), 3000)
        this.GC = () => {
            // 回收待测试
        }
    }
    // 计算样式
    let MathStyle = function(){
        AspectRatio = (document.documentElement.clientWidth > 1000) ? 0.7 : 0.5
        let videoWidth = (document.getElementById('LiveStream').videoWidth / document.getElementById('LiveStream').videoHeight) * (document.documentElement.clientHeight * AspectRatio)
        return {
            width: videoWidth,
            left: (document.documentElement.clientWidth / 2) - (videoWidth / 2)
        }
    }
    // xhr方法
    const XHR = (Method, Url, Data, callback, Type) => {
        let Xhr = new XMLHttpRequest()
        Xhr.open(Method, Url, true)
        Type && (Xhr.responseType = Type)
        Xhr.send(Data)
        Xhr.onload = (Evrnt) => (Xhr.status == 200) && callback(Xhr.response)
    }
    // 加载媒体流
    const GETSTREAM = ({MediaVideo, mimeCodec, FILE}, CALLBACK) => {
        // 如果支持此API就拉取流
        if(window.MediaSource){
            let mediaSource = new MediaSource() // 初始化 MediaSource
            MediaVideo.src = window.URL.createObjectURL(mediaSource) // 视频地址指向 MediaSource
            let mediaSourceCallback = function(){
                let sourceBuffer = mediaSource.addSourceBuffer(mimeCodec) // MIME类型
                // Xhr获取视频切片
                XHR('GET', FILE, null, (StreamArray) => {
                    sourceBuffer.addEventListener('updateend', () => mediaSource.endOfStream())
                    sourceBuffer.appendBuffer(StreamArray)
                }, 'arraybuffer')
            }
            // MediaSource ON 事件
            mediaSource.addEventListener('sourceopen', mediaSourceCallback, false)
            mediaSource.addEventListener('webkitsourceopen', mediaSourceCallback, false)
            mediaSource.addEventListener('webkitsourceended', (Event) => CALLBACK('==>> mediaSource readyState: ' + Event.readyState), false)
        }else{
            CALLBACK('==>> MediaSource API is not available') // 不支持
        }
    }
    // 全屏
    const OpenFullScreen = (element) => {
        element.requestFullscreen && element.requestFullscreen()
        element.mozRequestFullScreen && element.mozRequestFullScreen()
        element.webkitRequestFullscreen && element.webkitRequestFullscreen()
        element.msRequestFullscreen && element.msRequestFullscreen()
    }
    // 退出全屏
    const ExitFullscreen = () => {
        document.exitFullscreen && document.exitFullscreen()
        document.mozCancelFullScreen && document.mozCancelFullScreen()
        document.webkitExitFullscreen && document.webkitExitFullscreen()
    }
    // 全屏函数事件处理
    const ViewFullEvent = () => {
        let fullscreenElement = document.fullscreenEnabled || document.mozFullscreenElement || document.webkitFullscreenElement
        // 控制条显示5秒
        Module.LiveStreamControls.opacity = 1
        setTimeout(() => (delete Module.LiveStreamControls.opacity), 5000)
        // 视频resize
        console.log(Module.LivePlayStyle.width)
        if(fullscreenElement){
            FullScreenType = true
            Module.FullScreenType = true
            Module.LivePlayStyle.left = '0px'
            Module.LivePlayStyle.width = document.documentElement.clientWidth - 2 + 'px'
            Module.VideoStyle.width = document.documentElement.clientWidth + 'px'
            Module.HeadStyle['z-index'] = '-100'
        }else{
            FullScreenType = false
            Module.FullScreenType = false
            Module.LivePlayStyle.left = Number(sessionStorage.LivePlayStyleLeft) + 'px'
            Module.LivePlayStyle.width = Number(sessionStorage.LivePlayStyleWidth) + 'px'
            Module.VideoStyle.width = ''
            Module.HeadStyle['z-index'] = 1
        }
    }
    
    
    // 初始化Vue
    Module = new Vue(new function(){
        // 组件节点
        this.el = '#docker'
        // 组件参数
        this.data = {
            // 头部控制样式
            HeadStyle:{
              'z-index':''  
            },
            // 加载动画
            Animated: true,
            fadeInDown: true,
            fadeInUp: true,
            PostSubtitles:false,
            // 菜单控制
            MenuTips:false,
            // 用户
            User:{
                'opacity':0,
                'z-index': -100
            },
            // 登录
            Login:{
                'opacity':1
            },
            // 用户信息
            MenuUser:false,
            // 加载动画
            LiveStreamLoadAnimation:false,
            LiveStreamLoadAnimationStyle:{
                'left': (document.documentElement.clientWidth / 2) - 25 + 'px',
                'top': (document.documentElement.clientHeight * AspectRatio / 2) - 25 + 'px',
                'opacity':1
            },
            // 通知
            Notification:false,
            NotificationStyle:{
                'opacity':0,
                'z-index': -100
            },
            // 搜索
            search:{
                'right':'120px'
            },
            // 控制条显示隐藏
            LiveStreamControls:{
                'opacity':'1'
            },
            LiveStreamPlan:{
                'background-color': '',
                'height': '',
                'top':''
            },
            // 视频播放器样式
            LivePlayStyle:{
                'width': '0px',
                'left': '0px',
                'opacity':'0'
            },
            // 视频播放器透明度
            VideoStyle:{
                'opacity':'1',
                'width':false
            },
            // 播放控制
            VideoPause:true, // 暂停图标
            VideoPlay:false, // 播放图标
            LiveStreamPlanStyle:{ // 进度条样式
                'width':'0%'
            },
            playPauseType:true, // 是否播放
            volumedown: localStorage.VideoVolume == '0' ? false : true, // 音量正常
            volumeoff: localStorage.VideoVolume == '0' ? true : false, // 音量关
            volumeType: localStorage.VideoVolume == '0' ? false : true, // 音量大小
            VideoVolumeStyle:{ // 音量控制条样式
                'opacity':'0'
            },
            VideoVolumeResizeStyle:{ // 音量控制条进度
                'width': localStorage.VideoVolume == undefined ? '100%' : Number(localStorage.VideoVolume) * 100 + '%'
            },
            // 全屏
            FullScreenType:false,
            // 视频推荐
            VideoRecommend: false
        }
        // 绑定事件
        this.methods = {
            // 播放暂停
            playPause: () => {
                if(Module.playPauseType == true){
                    document.getElementById('LiveStream').pause()
                    Module.playPauseType = false
                    Module.VideoPause = false
                    Module.VideoPlay = true
                }else{
                    document.getElementById('LiveStream').play()
                    Module.playPauseType = true
                    Module.VideoPause = true
                    Module.VideoPlay = false
                }
            },
            // 音量关闭打开
            Volume: () => {
                if(Module.volumeType == true){
                    document.getElementById('LiveStream').volume = 0
                    localStorage.VideoVolume = 0
                    Module.VideoVolumeResizeStyle.width = '0%'
                    Module.volumeType = false
                    Module.volumedown = false
                    Module.volumeoff = true
                }else{
                    Module.volumeType = true
                    Module.volumeoff = false
                    Module.volumedown = true
                    if(localStorage.VideoVolume == undefined || localStorage.VideoVolume == '0'){
                        document.getElementById('LiveStream').volume = 1
                        localStorage.VideoVolume = 1
                        Module.VideoVolumeResizeStyle.width = '100%'
                    }else{
                        document.getElementById('LiveStream').volume = Number(localStorage.VideoVolume)
                        Module.VideoVolumeResizeStyle.width = Number(localStorage.VideoVolume) * 100 + '%'
                    }
                }
            },
            // 视频全屏
            VideoFullScreen: () => {
                if(Module.FullScreenType){
                    ExitFullscreen()
                }else{
                    OpenFullScreen(document.querySelectorAll('.live-play')[0])
                }
            },
            // 视频因加载暂停
            waiting: () => {
                Module.LiveStreamLoadAnimation = false
                Module.LiveStreamLoadAnimationStyle.opacity = 1
                Module.VideoStyle.opacity = 0.5
            },
            // 视频加载完成播放
            playing: () => {
                Module.LiveStreamLoadAnimation = true
                Module.LiveStreamLoadAnimationStyle.opacity = 0
                 // 控制条显示5秒
                Module.LiveStreamControls.opacity = 1
                setTimeout(() => (delete Module.LiveStreamControls.opacity), 5000)
                Module.VideoStyle.opacity = 1
            },
            // 菜单控制
            HeadMenu: () => {
                Module.MenuTips = (Module.MenuTips == false) ? true : false
                Module.MenuUser = false
                Module.Notification = false
            },
            // 用户信息
            HeadUserTab: () => {
                Module.MenuUser = (Module.MenuUser == false) ? true : false
                Module.MenuTips = false
                Module.Notification = false
            },
            // 切换通知
            NotificationTab: () => {
                Module.Notification = (Module.Notification == false) ? true : false
                Module.MenuTips = false
                Module.MenuUser = false
            },
            // 视频可以在不中断的情况下触发
            canplaythrough: () => {
                // 判断是否已经加载
                if(VideoLoad == false){
                    VideoLoad = true
                    let Style = MathStyle()
                    Module.LivePlayStyle.width = Style.width + 'px'
                    Module.LivePlayStyle.left =  Style.left + 'px'
                    Module.VideoStyle.width = Style.width - 1 + 'px'
                    Module.LiveStreamLoadAnimation = true
                    Module.LiveStreamLoadAnimationStyle.opacity = 0
                    Module.LivePlayStyle.opacity = 1
                    Module.PostSubtitles = true
                    document.getElementById('LiveStream').volume = localStorage.VideoVolume == undefined ? 1 : Number(localStorage.VideoVolume) // 检查音量设置
                    document.getElementById('LiveStream').currentTime = (localStorage.VideoPlayCurrentTime == undefined || Number(localStorage.VideoPlayCurrentTime) >= document.getElementById('LiveStream').duration) ? 0 : Number(localStorage.VideoPlayCurrentTime) // 检查上次播放进度
                    document.getElementById('LiveStream').play()
                    sessionStorage.LivePlayStyleWidth = Style.width - 2
                    sessionStorage.LivePlayStyleLeft = Style.left
                    // 窗口大小改变触发
                    window.onresize = () => {
                        // 是否是全屏触发
                        if(FullScreenType == false){
                            let Style = MathStyle()
                            Module.LivePlayStyle.width = Style.width + 'px'
                            Module.LivePlayStyle.left =  Style.left + 'px'
                            sessionStorage.LivePlayStyleWidth = Style.width - 2
                            sessionStorage.LivePlayStyleLeft = Style.left
                        }
                        // 重新计算加载动画位置
                        Module.LiveStreamLoadAnimationStyle.left = (document.documentElement.clientWidth / 2) - 25 + 'px'
                        Module.LiveStreamLoadAnimationStyle.top = (document.documentElement.clientHeight * AspectRatio / 2) - 25 + 'px'
                    }
                    // 控制条显示5秒
                    setTimeout(() => (delete Module.LiveStreamControls.opacity), 5000)
                }
            },
            // 视频播放位置改变
            timeupdate: (Event) => {
                Module.LiveStreamPlanStyle.width = Event.target.currentTime / Event.target.duration * 100 + '%', 
                localStorage.VideoPlayCurrentTime = Event.target.currentTime
                /* 弹幕   测试状态 不开启
                let key = Math.ceil(Event.target.currentTime) // 当前播放时间
                // 这里是避免重复触发的函数
                if(key != StreamSubtitles.play){
                    StreamSubtitles.play = key
                    let Subtitles = StreamSubtitles.data[key]
                    // 找到弹幕数据
                    if(Subtitles){
                        // 开始匹配弹幕填充管道位置
                        let forStream = true
                        for(let i = 0; i < StreamSubtitles.stream.length; i++){
                            let data = StreamSubtitles.stream[i]
                            // 管道可写并且位置已找到
                            if(data.type && forStream){
                                // 覆盖状态并关闭管道
                                forStream = false
                                data.type = false
                                // 递交处理函数 自动打开可写状态
                                StreamSubtitles.StreamTime(i)
                                // 填充弹幕
                                document.querySelectorAll('.subtitles-box')[0].innerHTML += `<div class="subtitles" data-time="${Subtitles.time}" style="top:0;width:${Subtitles.text.length * 20}px">${Subtitles.text}</div>`
                                // 触发回收函数
                                StreamSubtitles.GC()
                            }
                        }
                    }
                }
                */
            },
            // 视频播放结束
            ended: () => {
                Module.playPauseType = false
                Module.VideoPause = false
                Module.VideoPlay = true
                // 显示推荐 Module.VideoRecommend = true
            },
            // 显示音量条
            VolumeControlMouseenter: () => (Module.VideoVolumeStyle.opacity = 1),
            // 隐藏音量条
            VolumeControlMouseleave: () => (Module.VideoVolumeStyle.opacity = 0),
            // 显示进度条
            controlsResizeMouseenter: () => {
                Module.LiveStreamPlan['background-color'] = '#999'
                Module.LiveStreamPlan['height'] = '4px'
                Module.LiveStreamPlan['top'] = '-2px'
            },
            // 隐藏进度条
            controlsResizeMouseleave: () => {
                Module.LiveStreamPlan['background-color'] = ''
                Module.LiveStreamPlan['height'] = ''
                Module.LiveStreamPlan['top'] = ''
            },
            // 鼠标点击调整音量
            VideoVolumeResize: (Event) => {
                let i = Event.clientX - (Number(Module.LivePlayStyle.left.split('p')[0]) + 70)
                Module.VideoVolumeResizeStyle.width = Math.ceil(i) + '%'
                document.getElementById('LiveStream').volume = Math.ceil(i) / 100
                localStorage.VideoVolume = Math.ceil(i) / 100
                Module.volumeType = true
                Module.volumeoff = false
                Module.volumedown = true
            },
            // 进度条跳转
            LiveStreamPlanResize: (Event) => {
                let sum = document.getElementById('LiveStream').duration
                let time = sum * ((Event.clientX - Number(Module.LivePlayStyle.left.split('p')[0])) / (FullScreenType == true ? document.documentElement.clientWidth : Number(sessionStorage.LivePlayStyleWidth)))
                document.getElementById('LiveStream').currentTime = (time >= sum) ? sum : time // 如果超过就设置最大
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
    // 初始化弹幕
    XHR('GET', `./Subtitles${location.search}`, null, (magess) => (StreamSubtitles.data = JSON.parse(magess), console.log(magess)))
    // 加载直播流
    GETSTREAM({
        MediaVideo: document.getElementById('LiveStream'),
        mimeCodec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
        FILE: 'http://localhost/public/media/stream/Video.mp4'
    }, (Error, Fun) => {
        console.log('==>> GetStream ERROR ', Error, Fun)
    })
    // 全屏函数监听
    document.addEventListener("fullscreenchange", ViewFullEvent)
    document.addEventListener("mozfullscreenchange", ViewFullEvent)
    document.addEventListener("webkitfullscreenchange", ViewFullEvent)
    document.addEventListener("msfullscreenchange", ViewFullEvent)
    // 全局按键监听
    document.body.onkeydown = (Event) => {
        (Event.which == 27 && FullScreenType) && ExitFullscreen() // 退出全屏
        (Event.which == 37) && (document.getElementById('LiveStream').currentTime = Number(localStorage.VideoPlayCurrentTime) - 10) // 视频后退
        (Event.which == 39) && (document.getElementById('LiveStream').currentTime = Number(localStorage.VideoPlayCurrentTime) + 10) // 视频前进
    }
    // 登录
    $('#Login').click(() => location.href = (location.href = `${location.origin}/Login`))
    // 视频测试对象
    document.getElementById('LiveStream').onprogress = (Event) => {
        console.log('视频测试对象 ==>>', new MediaProject(document.getElementById('LiveStream')))
    }
    
 
}