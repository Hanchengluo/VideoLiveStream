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
    // 弹幕管道
    // 弹幕使用管道填充模式
    let StreamSubtitles = new function(){
        // play 保存播放时间
        // data 保存弹幕对象
        // stream 保存管道信息
        // StreamTime 用于变更管道可写状态
        this.play = 0
        this.data = new Object()
        this.length = Math.ceil((document.documentElement.clientHeight * AspectRatio - 150) / 20)
        this.stream = []
        for(let i = 0; i < this.length; i ++){
            this.stream.push({type:true, top: i * 20 + 20})
        }
        this.StreamTime = (i) => setTimeout(() => (StreamSubtitles.stream[i].type = true), 3000)
        this.GC = () => {
            // 回收待测试
        }
    }
    // 计算样式
    function MathStyle(){
        AspectRatio = (document.documentElement.clientWidth > 1000) ? 0.7 : 0.5
        let videoWidth = (document.getElementById('LiveStream').videoWidth / document.getElementById('LiveStream').videoHeight) * (document.documentElement.clientHeight * AspectRatio)
        this.width = videoWidth
        this.left = (document.documentElement.clientWidth / 2) - (videoWidth / 2)
        this.contentStyleWidth = document.documentElement.clientWidth * 0.9
        this.videoAutoStyleWidth = document.documentElement.clientWidth * 0.9 * 0.6
        this.chatStyleWidth = document.documentElement.clientWidth * 0.9 * 0.4 - 10
    }
    
    
    // xhr方法
    const XHR = (Method, Url, Data, callback) => {
        let Xhr = new XMLHttpRequest()
        Xhr.open(Method, Url)
        Xhr.onreadystatechange = () => {
            if(Xhr.readyState == 4 && Xhr.status == 200){
                if(typeof Data == 'function'){
                    Data(Xhr.responseText)
                }else{
                    callback(Xhr.responseText)
                } 
            }
        }
        if(typeof Data == 'function'){
            Xhr.send()
        }else{
            Xhr.send(Data)
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
    let ExitFullscreen = () => {
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
        if(fullscreenElement){
            FullScreenType = true
            Module.FullScreenType = true
            Module.LivePlayStyle.left = '0px'
            Module.LivePlayStyle.width = document.documentElement.clientWidth - 2 + 'px'
            Module.HeadStyle['z-index'] = 0
        }else{
            FullScreenType = false
            Module.FullScreenType = false
            Module.LivePlayStyle.left = Number(sessionStorage.LivePlayStyleLeft) + 'px'
            Module.LivePlayStyle.width = Number(sessionStorage.LivePlayStyleWidth) + 'px'
            Module.HeadStyle['z-index'] = 1
        }
    }
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
    
    
    // 初始化弹幕
    XHR('GET', `./Subtitles${location.search}`, (magess) => (StreamSubtitles.data = JSON.parse(magess)))
    
    
    // 初始化Vue
    Module = new Vue(new function(){
        // 组件节点
        this.el = '#Vue'
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
            // 菜单控制
            MenuTips:false,
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
            // 推流地址
            LiveStreamSrc:'./public/media/stream/VideoTest.mp4',
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
                'opacity':'1'
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
            VideoRecommend: false,
            // 内容区
            contentStyle:{
                'width': document.documentElement.clientWidth * 0.9 + 'px'
            },
            videoAutoStyle:{
                'width': document.documentElement.clientWidth * 0.9 * 0.6 + 'px'
            },
            chatStyle:{
                'width': document.documentElement.clientWidth * 0.9 * 0.4 - 10 + 'px'
            }
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
                    let Style = new MathStyle()
                    Module.LivePlayStyle.width = Style.width + 'px'
                    Module.LivePlayStyle.left =  Style.left + 'px'
                    Module.LiveStreamLoadAnimation = true
                    Module.LiveStreamLoadAnimationStyle.opacity = 0
                    Module.LivePlayStyle.opacity = 1
                    document.getElementById('LiveStream').volume = localStorage.VideoVolume == undefined ? 1 : Number(localStorage.VideoVolume) // 检查音量设置
                    document.getElementById('LiveStream').currentTime = (localStorage.VideoPlayCurrentTime == undefined || Number(localStorage.VideoPlayCurrentTime) >= document.getElementById('LiveStream').duration) ? 0 : Number(localStorage.VideoPlayCurrentTime) // 检查上次播放进度
                    document.getElementById('LiveStream').play()
                    sessionStorage.LivePlayStyleWidth = Style.width - 2
                    sessionStorage.LivePlayStyleLeft = Style.left
                    // 窗口大小改变触发
                    window.onresize = () => {
                        // 是否是全屏触发
                        if(FullScreenType == false){
                            let Style = new MathStyle()
                            Module.LivePlayStyle.width = Style.width + 'px'
                            Module.LivePlayStyle.left =  Style.left + 'px'
                            sessionStorage.LivePlayStyleWidth = Style.width - 2
                            sessionStorage.LivePlayStyleLeft = Style.left
                            Module.contentStyle.width = Style.contentStyleWidth + 'px'
                            Module.videoAutoStyle.width = Style.videoAutoStyleWidth + 'px'
                            Module.chatStyle.width = Style.chatStyleWidth + 'px'
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
        }
    })
    
    
    // 视频测试对象
    function MediaProject(Media){
        //错误状态  
        this.error = Media.error                                     // null:正常  
        this.errorcode = Media.error && Media.error.code             // 1.用户终止 2.网络错误 3.解码错误 4.URL无效  
        //网络状态  
        this.currentSrc = Media.currentSrc                           // 返回当前资源的URL  
        this.src = Media.src                                         //  返回或设置当前资源的URL  
        this.canPlayType = (type) => Media.canPlayType(type)         // 是否能播放某种格式的资源  
        this.networkState = Media.networkState                       // 0.此元素未初始化  1.正常但没有使用网络  2.正在下载数据  3.没有找到资源  
        this.load = Media.load                                       // 重新加载src指定的资源  
        this.TimeRanges = Media.buffered                             // 返回已缓冲区域，TimeRanges  
        this.preload = Media.preload                                 // none:不预载 metadata:预载资源信息 auto:  
        //准备状态  
        this.readyState = Media.readyState                           // 1:HAVE_NOTHING 2:HAVE_METADATA 3.HAVE_CURRENT_DATA 4.HAVE_FUTURE_DATA 5.HAVE_ENOUGH_DATA  
        this.seeking = Media.seeking                                 // 是否正在seeking  
        //回放状态  
        this.currentTime = Media.currentTime                         // 当前播放的位置，赋值可改变位置  
        this.startTime = Media.startTime                             // 一般为0，如果为流媒体或者不从0开始的资源，则不为0  
        this.duration = Media.duration                               // 当前资源长度 流返回无限  
        this.paused = Media.paused                                   // 是否暂停  
        this.defaultPlaybackRate = Media.defaultPlaybackRate         // 默认的回放速度，可以设置  
        this.playbackRate = Media.playbackRate                       // 当前播放速度，设置后马上改变  
        this.played = Media.played                                   // 返回已经播放的区域，TimeRanges，关于此对象见下文  
        this.seekable = Media.seekable                               // 返回可以seek的区域 TimeRanges  
        this.ended = Media.ended                                     // 是否结束  
        this.autoPlay = Media.autoPlay                               // 是否自动播放  
        this.loop = Media.loop                                       // 是否循环播放
        //控制  
        this.controls = Media.controls                               // 是否有默认控制条  
        this.volume = Media.volume                                   // 音量  
        this.muted = Media.muted                                     // 静音  
        //TimeRanges(区域)对象  
        this.length = this.TimeRanges.length                         // 区域段数  
        this.start = (index) => this.TimeRanges.start(index)         // 第index段区域的开始位置  
        this.end = (index) => this.TimeRanges.end(index)             // 第index段区域的结束位置 
    }
    
    document.getElementById('LiveStream').onprogress = function(Event){
        // console.log(new MediaProject(document.getElementById('LiveStream')))
    }
    
 
}