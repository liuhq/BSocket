# BSocket - websocket for bilibili open-live

BSocket 是 Bilibili 直播开放平台 WebSocket 长连接封装包，目前可用于 Node 环境（浏览器环境有时间在试试）。

>能力有限，有什么错误还请大家指出，谢谢！

---

## Install

```
npm i b-socket --save
```

## Usage

### 1. 引入包

如果使用 ESM 模块管理，请通过 import 语句引入。

```javascript
import BSocket from "b-socket"
```

如果使用 CommonJS 模块管理，请通过 require 语句引入。

```javascript
const BSocket = require("b-socket")
```

### 2. BSocket 类

封装的 BSocket 类是静态类，直接使用。

类的成员:

`appKey` - 属性 | B站直播开发平台分发给你的 `access_key_id`

`appSecret` - 属性 | B站直播开发平台分发给你的 `access_key_secret`

`bodyData` - 属性 | 发送 post 请求的数据，一般为房间号 `{ "room_id": your_room }`

`api` - 属性 | 请求地址，不作修改，默认为 `/v1/common/websocketInfo`

`connect()` - 方法 | 创建并返回一个 `BilibiliWebSocket` 实例

例：

```javascript
BSocket.appKey = "bbtv233"
BSocket.appSecret = "anhao666"
BSocket.bodyData = { "room_id": 9007928 }

// async
const bs = await BSocket.connect()

// or promise
BSocket.connect()
    .then(r => {
        ...//do something
    })
```

### BilibiliWebSocket 实例

`BilibiliWebSocket` 实例目前提供了 6 个方法和 1 个属性

`websocketInfo` - 属性 | post 鉴权请求成功后返回的数据，详见 🔗 [获取长连地址和TOKEN](https://open-live.bilibili.com/document/doc&tool/api/websocket.html#_1-%E8%8E%B7%E5%8F%96%E9%95%BF%E8%BF%9E%E5%9C%B0%E5%9D%80%E5%92%8Ctoken)

`Open([host, [port]])` - 方法 | 启动连接。可选参数：
- `host` - 长连接地址，可以在 `websocketInfo` 中获取；
- `port` - 长连接端口，同样在 `websocketInfo` 中获取。

例：
```javascript
// use the default
bs.Open()

// or use data from websocketInfo
bs.Open("broadcastlv.chat.bilibili.com", 2243)

// or promise
BSocket.connect()
    .then(r => {
        r.Open()
        ...//do something
    })
```

`Close()` - 方法 | 关闭连接。

`getGeneralMsgs()` - 方法
- 获取一般 Proto 包消息（非弹幕礼物），如鉴权反馈、心跳反馈，详见 🔗 [发送心跳](https://open-live.bilibili.com/document/doc&tool/api/websocket.html#_3-%E5%8F%91%E9%80%81%E5%BF%83%E8%B7%B3) `Operation` 字段含义。返回值是一个长度为4的数组。

`getReadyState()` - 方法
- 获取当前连接状态。0 为 `CONNECTING`，1 为 `OPEN`，2 为 `CLOSING`，3 为 `CLOSED`, 参考 🔗 [MDN 文档 - WebSocket.readyState](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/readyState)

`getWSURL()` - 方法 | 获取当前长连接链接地址.

`listenMsgs([callback])` - 方法 | 监听消息。可选参数：
- `callback` - 回调函数，函数参数 `data`，用于处理监听接收到的弹幕礼物消息。

例：
```javascript
// will print messages in console
bs.listenMsgs()

// or give a callback, then get the danmu and user
bs.listenMsgs(data => {
    console.log(data.data.uname)    // 漆与丶QoQ
    console.log(data.data.uid)      // 8****8
    console.log(data.data.msg)      // "test"
})

// data's structure
data = {
    data: {
        fans_medal_level: 0,
        fans_medal_name: '...',
        fans_medal_wearing_status: false,
        guard_level: 0,
        msg: 'test',
        timestamp: 165****318,
        uid: 8****8,
        uname: '漆与丶QoQ',
        uface: '...',
        msg_id: '...',
        room_id: 9007928
    },
    cmd: 'LIVE_OPEN_PLATFORM_DM' // or other
}
```

### 较为完整的使用过程……？

```javascript
import BSocket from "b-socket"

BSocket.appKey = "bbtv233"
BSocket.appSecret = "anhao666"
BSocket.bodyData = { "room_id": 9007928 }

const bs = await BSocket.connect()

bs.Open()

const arrMsgs = []

bs.listenMsgs(data => {
    if ("LIVE_OPEN_PLATFORM_DM" == data.cmd) {
        arrMsgs.push({
            uid: data.data.uid,
            uname: data.data.uname,
            uface: data.data.uface
            msg: data.data.msg
        })
    }
})

// do something
```

## Contribute

目前只实现了一小部分功能，欢迎 Issue 和 Pull Request ~

## License

Under the [MIT](LICENSE)
