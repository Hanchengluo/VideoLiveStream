Live Stream Framework
===
> 这是一个直播推流系统框架  优先解决PC端的兼容
> 使用本框架会默认收集你的少量项目信息数据上传至云端服务器，在收集的数据中不包含隐私数据，关于信息收集的条文请见附件

架构
---
> 前后端整体的架构

服务端
---
> node.js mongodb nginx ffmpeg
#### 视频推流
> 视频推流由主播端通过RTMP协议推送到FFmpeg搭建的流媒体服务器 流服务器通过指定的配置转码之后发送给Node.JS创建的Buffer区，Node.JS管理流媒体池，前端按需取流
* 
