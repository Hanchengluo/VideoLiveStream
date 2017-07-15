/*!
 * Live Stream Framework -https://github.com/xivistudios/MobileGame
 * Version - 0.1
 * Licensed under the README license - https://github.com/xivistudios/MobileGame/blob/master/README.md
 *
 * Copyright (c) 2017 XIVI Studios - Mr.Panda
 */


window.onload = () => {
    
    
    // 屏幕比率
    var AspectRatio = (document.documentElement.clientWidth > 1000) ? 0.7 : 0.5
    // 视频是否加载完成
    var VideoLoad = false
    
    
    // xhr方法
    var XHR = (Method, Url, Data, callback) => {
        var Xhr = new XMLHttpRequest()
        Xhr.onreadystatechange = () => {
            (Xhr.readyState == 4 && Xhr.status == 200) && callback(Xhr.responseText)
        }
        Xhr.open(Method, Url)
        Xhr.send(Data)
    }
    // 全屏
    var FullScreenType = false // 是否全屏
    var OpenFullScreen = (element)=>{
        element.requestFullscreen && element.requestFullscreen()
        element.mozRequestFullScreen && element.mozRequestFullScreen()
        element.webkitRequestFullscreen && element.webkitRequestFullscreen()
        element.msRequestFullscreen && element.msRequestFullscreen()
    }
    // 退出全屏
    var ExitFullscreen = ()=>{
        document.exitFullscreen && document.exitFullscreen()
        document.mozCancelFullScreen && document.mozCancelFullScreen()
        document.webkitExitFullscreen && document.webkitExitFullscreen()
    }
    
    
    // vue 视频组件
    var Module = new Vue(new function(){
        // 组件节点
        this.el = '#LiveBody';
        // 组件参数
        this.data = {
            // 加载动画
            LiveStreamLoadAnimation:false,
            LiveStreamLoadAnimationStyle:{
                'left': (document.documentElement.clientWidth / 2) - 25 + 'px',
                'top': (document.documentElement.clientHeight * AspectRatio / 2) - 25 + 'px'
            },
            // 推流地址
            LiveStreamSrc:'/public/media/stream/VideoTest.webm',
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
            FullScreenType:false
        }
        // 绑定事件
        this.methods = {
            // 播放暂停
            playPause:function(){
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
            Volume:function(){
                var video = document.getElementById('LiveStream')
                if(Module.volumeType == true){
                    video.volume = 0
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
                        video.volume = 1
                        localStorage.VideoVolume = 1
                        Module.VideoVolumeResizeStyle.width = '100%'
                    }else{
                        video.volume = Number(localStorage.VideoVolume)
                        Module.VideoVolumeResizeStyle.width = Number(localStorage.VideoVolume) * 100 + '%'
                    }
                }
            }
        }
    })
    
    
    // vue菜单组件
    var Head = new Vue(new function(){
        // 组件节点
        this.el = '#Head';
        this.data = {
            // 菜单控制
            MenuTips:false,
            // 用户信息
            MenuUser:false
        }
    })
    
    
    // 菜单控制
    document.querySelectorAll('.head-menu')[0].onclick = () => (Head.MenuTips = (Head.MenuTips == false) ? true : false)
    
        
    // 视频可以在不中断的情况下触发
    document.getElementById('LiveStream').oncanplaythrough = () => {
        var Video = document.getElementById('LiveStream')
        // 计算样式
        function MathStyle(){
            AspectRatio = (document.documentElement.clientWidth > 1000) ? 0.7 : 0.5
            var videoWidth = videoWidth = Video.videoWidth / Video.videoHeight * (document.documentElement.clientHeight * AspectRatio)
            this.width = videoWidth
            this.left = (document.documentElement.clientWidth / 2) - (videoWidth / 2)
        }
        if(VideoLoad == false){
            var Style = new MathStyle()
            Module.LivePlayStyle.width = Style.width + 'px'
            Module.LivePlayStyle.left =  Style.left + 'px'
            Video.volume = localStorage.VideoVolume == undefined ? 1 : Number(localStorage.VideoVolume)
            Module.LiveStreamLoadAnimation = true
            Module.LivePlayStyle.opacity = 1
            Video.play()
            VideoLoad = true
            sessionStorage.LivePlayStyleWidth = Style.width - 2
            sessionStorage.LivePlayStyleLeft = Style.left
            // 窗口大小改变触发
            window.onresize = () => {
                if(FullScreenType == false){
                    var Style = new MathStyle()
                    Module.LivePlayStyle.width = Style.width + 'px'
                    Module.LivePlayStyle.left =  Style.left + 'px'
                    sessionStorage.LivePlayStyleWidth = Style.width - 2
                    sessionStorage.LivePlayStyleLeft = Style.left
                }
            }
            // 控制条显示5秒
            setTimeout(()=>{
                delete Module.LiveStreamControls.opacity
            }, 5000)
        }
    }
    // 视频播放位置改变
    document.getElementById('LiveStream').ontimeupdate = (Event) => {
        Module.LiveStreamPlanStyle.width = Event.target.currentTime / document.getElementById('LiveStream').duration * 100 + '%'
    }
    // 视频播放结束
    document.getElementById('LiveStream').onended = (Event) => {
        Module.playPauseType = false
        Module.VideoPause = false
        Module.VideoPlay = true
    }
    // 显示音量条
    document.getElementById('VideoVolumeControl').onmouseenter = (Event) => {
        Module.VideoVolumeStyle.opacity = 1
    }
    // 隐藏音量条
    document.getElementById('VideoVolumeControl').onmouseleave = (Event) => {
        Module.VideoVolumeStyle.opacity = 0
    }
    // 鼠标点击调整音量
    document.getElementById('VideoVolumeResize').onclick = (Event) => {
        var video = document.getElementById('LiveStream')
        var i = Event.clientX - (Number(Module.LivePlayStyle.left.split('p')[0]) + 70)
        Module.VideoVolumeResizeStyle.width = Math.ceil(i) + '%'
        video.volume = Math.ceil(i) / 100
        localStorage.VideoVolume = Math.ceil(i) / 100
        Module.volumeType = true
        Module.volumeoff = false
        Module.volumedown = true
    }
    // 全屏函数事件处理
    var ViewFullEvent = () => {
        var Video = document.getElementById('LiveStream')
        var fullscreenElement = document.fullscreenEnabled || document.mozFullscreenElement || document.webkitFullscreenElement
        // 控制条显示5秒
        Module.LiveStreamControls.opacity = 1
        setTimeout(()=>{
            delete Module.LiveStreamControls.opacity
        }, 5000)
        // 视频resize
        if(fullscreenElement){
            FullScreenType = true
            Module.FullScreenType = true
            Module.LivePlayStyle.left = '0px'
            Module.LivePlayStyle.width = document.documentElement.clientWidth - 2 + 'px'
        }else{
            FullScreenType = false
            Module.FullScreenType = false
            Module.LivePlayStyle.left = Number(sessionStorage.LivePlayStyleLeft) + 'px'
            Module.LivePlayStyle.width = Number(sessionStorage.LivePlayStyleWidth) + 'px'
        }
    }
    // 全屏函数监听
    document.addEventListener("fullscreenchange", ViewFullEvent)
    document.addEventListener("mozfullscreenchange", ViewFullEvent)
    document.addEventListener("webkitfullscreenchange", ViewFullEvent)
    document.addEventListener("msfullscreenchange", ViewFullEvent)
    // 视频全屏
    document.getElementById('VideoFullScreen').onclick = () => {
        if(Module.FullScreenType == false){
            OpenFullScreen(document.querySelectorAll('.live-play')[0])
        }else{
            ExitFullscreen() 
        }
    }
    // 进度条跳转
    document.getElementById('LiveStreamPlan').onclick = (Event) => {
        var video = document.getElementById('LiveStream')
        var sum = document.getElementById('LiveStream').duration
        var time = sum * ((Event.clientX - Number(Module.LivePlayStyle.left.split('p')[0])) / (FullScreenType == true ? document.documentElement.clientWidth : Number(sessionStorage.LivePlayStyleWidth)))
        video.currentTime = (time >= sum) ? sum : time
    }
    // 显示进度条
    document.querySelectorAll('.live-stream-controls-resize')[0].onmouseenter = () => {
        Module.LiveStreamPlan['background-color'] = '#999'
        Module.LiveStreamPlan['height'] = '4px'
        Module.LiveStreamPlan['top'] = '-2px'
    }
    // 隐藏进度条
    document.getElementById('LiveStreamPlan').onmouseleave = () => {
        Module.LiveStreamPlan['background-color'] = ''
        Module.LiveStreamPlan['height'] = ''
        Module.LiveStreamPlan['top'] = ''
    }
    
    
    // 媒体对象
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
    
 
}