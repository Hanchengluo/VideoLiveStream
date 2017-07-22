Live Stream Framework
===
> 这是一个直播推流系统框架  优先解决PC端的兼容<br>
使用本框架会默认收集你的少量项目信息数据上传至云端服务器，在收集的数据中不包含隐私数据，关于信息收集的条文请见附件

架构
---
> 前后端整体的架构<br>
node.js mongodb nginx ffmpeg
##### 视频推流
>> 视频推流由主播端通过RTMP协议推送到FFmpeg搭建的流媒体服务器 流服务器通过指定的配置转码之后发送给Node.JS创建的Buffer区，Node.JS管理流媒体池，前端按需取流
* 主播端客户端通过RTMP协议推流，FFmpeg接收视频码流，并转码成MP4格式喂给Node.JS管理的流媒体池
* Node.JS管理流媒体池，按标准速率接受媒体流，并保持流媒体池的溢出和存储比率
* 前端通过制定的HTTP地址拉取指定的多媒体流，Node.JS接受请求并从流媒体池拉取指定的格式和分辨率
* Node.JS通知前端主动连接服务器的WebSocket端口，服务器开始推流
* 前端接收到视频流并通过WorkerServer开始解包并喂给MediaSourceAPI填充给<video>开始播放
