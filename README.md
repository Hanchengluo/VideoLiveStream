# Mobile Game Framework

> 这是一个游戏框架  优先解决移动端的兼容

## 架构

### 服务端
> node.js mongodb nginx

页面加载：
每次加载 / 路径都会由服务端分配一个session ID， 相当于将此次请求作为一个独立的请求打标记，并为此次请求下面的所有资源请求建立一个连接池，匹配加载数据，
