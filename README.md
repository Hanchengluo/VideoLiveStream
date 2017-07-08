# Mobile Game Framework

> 这是一个游戏框架  优先解决移动端的兼容

## 架构

### 服务端
> node.js mongodb nginx

#### 页面加载
每次加载 / 路径都会由服务端分配一个session ID， 相当于将此次请求作为一个独立的请求打标记，并为此次请求下面的所有资源请求建立一个连接池，匹配加载数据

1.客户端请求 / ,服务器接收请求，计算一个唯一的session，并通过cookie发送到客户端，客户端接收并设置cookie session，这个session只限于此次应用资源请求，当所有资源加载完成之后销毁

2.对于所有资源文件的加载；请求附带session id，服务端接收请求，匹配资源表，并开始发送buffer，发送完成之后再资源表中注销此资源，并通过服务端推送给前端，前端接收此次推送，并在前端注册自己的资源表，单个资源加载完成

#### 前后端通信
前端被动：前端开启服务器推送，开始接收服务器推送的事件

后端主动：服务器通知前端，开启websocket通道，并互相推送事件和数据

前端主动：前端rust后端api



