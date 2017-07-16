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