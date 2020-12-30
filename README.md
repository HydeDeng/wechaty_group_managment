# wechaty_group_managment [![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty) [![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)
use wechaty wxwork protocol to implement wechat group management.

# Wechaty
Wechaty 按照我的理解就是一个可以实现微信机器人的多端协议框架。为什么说是多端呢，因为他包含了微信pc协议，web协议，pad协议等。最近他在测试企业微信这块，所以有幸申请了一个token来玩。
# Wechaty token
## 什么是wechaty token
什么是wechaty token 呢，我们来看下面代码
```js
const bot = new Wechaty({
  puppet: 'wechaty-puppet-hostie',
  puppetOptions: {
    'your_token_here',
  }
});
```
每个wechaty实例都需要一个token，换句话说，没有token什么都做不了。

## 如果获取wechaty token
方法有两个：
1. 靠自己的劳动获取。
	1. 去官网 加这个机器人，然后回复 wechaty 进群聊。
![wechaty官方机器人](https://img-blog.csdnimg.cn/20201230105842403.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Npcm9kZW5n,size_16,color_FFFFFF,t_70)
	2. 然后机器人会给叫你去填一个分享计划的申请表，提交之后，没过几天就有人找到你，然后给你一个15天的临时token这个时候就能开始玩了。原话如下：
	> 您确认愿意参与开源激励计划，将最终成品代码开源同时在Wechaty社区内撰写一篇博客。在wechaty（wechaty.js.org）博客审核通过后，每在一个平台（知乎/简书/掘金等）提交一篇博客，Wechaty 社区额外提供3个月有效期 Token，凭博客链接联系JuziBOT申请Token 时长。
2. 直接用钱砸
    简单有效，不浪费时间，200/月，直接找他们客服说付费就ok

所以，要想要token要不然花时间，要不然就花钱。再次感慨时间就是金钱哈。还是富兰克林大大高瞻远瞩啊。
# Wechaty 与微信Hook的区别
说起wechaty，就不得不说另一种微信机器人的构建方式 - 微信hook。
这两者算是殊途共归。只是个人感觉微信hook比较符合国人的山寨精神。
微信hook用山寨大神们的话来说就不外乎两个词。
 1. 获取数据
 2. 创建子程序。
 我们这里主要说wechaty，所以微信hook我就一句话归纳一下，大神们用逆向的思想在计算机上找到微信每个动作的内存池，并计算偏移量，最后，找出规律，创建子程序来模拟微信的所有操作。所以微信hook有个最大的缺点，就是太依赖微信版本，也造成了其的不稳定。一旦一个版本停用，就得重新去研究。
而wechaty完全是两码事，他是模拟的微信的协议来创建的框架，不依赖与微信版本，程序员们可以安心的写下游代码，上游协议框架api这些事就交给wechaty团队来做。
# Wechaty会不会被封号
本身是不会封号的，但是用力太猛就说不准了，比如，你一天转发几万条消息，自动加几百个群，几千号人。。那不封你封睡呢-_-||。
# 自己的一个Wechaty的开源项目
下面呈上自己的用typescript写的一个wecahty项目，实现简单的加群，加好友，智能聊天等操作。

-- 文件目录
|-- app.ts
|-- config.ts
|-- mFriendShip.ts
|-- mMessage.ts
|-- mRoomJoin.ts
|-- mScan.ts
|-- mUser.ts

config.ts
```js
let config = {
    // puppet_padplus Token
    token: "your_token_here",
    // 机器人名字
    name: "疯疯",
    // 房间/群聊
    room: {
      // 管理群组列表
      roomList: {
        // 群名(用于展示，最好是群名，可随意) : 群id(这个可不能随意)
        院子: "R:1234567890",
        桌子: "R:1234567890"
      },
      // 加入房间回复
      roomJoinReply: `\n 你好，欢迎你的加入，请自觉遵守群规则，文明交流，最后，请向大家介绍你自己！ \n\n Hello, welcome to join, please consciously abide by the group rules, civilized communication, finally, please introduce yourself to everyone！😊`
    },
    // 私人
    personal: {
      // 好友验证自动通过关键字
      addFriendKeywords: ["加群", "前端"],
      // 是否开启加群
      addRoom: true
    }
  }
  export default config
```
app.ts
```js
import { Wechaty } from 'wechaty'
import mRoomJoin from "./mRoomJoin"
import mScan from "./mScan"
import mUser from "./mUser"
import mMessage from "./mMessage"
import mFriendShip from "./mFriendShip"

import config from "./config"

const token = config.token

const bot = new Wechaty({
  puppet: 'wechaty-puppet-hostie',
  puppetOptions: {
    token,
  }
});

  bot
  .on("scan", mScan) // 机器人需要扫描二维码时监听
  .on('login', mUser)
  .on("room-join", mRoomJoin) // 加入房间监听
  .on("message", mMessage(bot)) // 消息监听
  .on("friendship", mFriendShip) // 好友添加监听
  .start()
```

mFriendShip.ts
```js
import { Friendship } from "wechaty"

// 配置文件
import config from "./config"
// 好友添加验证消息自动同意关键字数组
const addFriendKeywords = config.personal.addFriendKeywords

// 好友添加监听回调
const mFriendShip = async (friendship: any) =>{
    let logMsg
    try {
      logMsg = "添加好友" + friendship.contact().name()
      console.log(logMsg)
      switch (friendship.type()) {
        /**
         * 1. 新的好友请求
         * 设置请求后，我们可以从request.hello中获得验证消息,
         * 并通过`request.accept（）`接受此请求
         */
        case Friendship.Type.Receive:
          // 判断配置信息中是否存在该验证消息
          if (addFriendKeywords.some(v => v == friendship.hello())) {
            logMsg = `自动通过验证，因为验证消息是"${friendship.hello()}"`
            // 通过验证
            await friendship.accept()
          } else {
            logMsg = "不自动通过，因为验证消息是: " + friendship.hello()
          }
          break
  
        /**
         * 2. 友谊确认
         */
        case Friendship.Type.Confirm:
          logMsg = "friend ship confirmed with " + friendship.contact().name()
          break
      }
      console.log(logMsg)
    } catch (e) {
      logMsg = e.message
    }
}
export default mFriendShip;
```
mMessage.ts
```ts
import { Message } from "wechaty"
// node-request请求模块包
import request from "request"

// 请求参数解码
import urlencode from "urlencode"
// 配置文件
import config from "./config"

// 机器人名字
let {name, room} = config
// 管理群组列表
const roomList = room.roomList

// 消息监听回调
let bot = (bot: any) => {
  return async function mMessage(msg: any) {
    // 判断消息来自自己，直接return
    if (msg.self()) return

    console.log("=============================")
    console.log(`msg : ${msg}`)
    console.log(
      `from: ${msg.from() ? msg.from().name() : null}: ${
        msg.from() ? msg.from().id : null
      }`
    )
    console.log(`to: ${msg.to()}`)
    console.log(`text: ${msg.text()}`)
    console.log(`isRoom: ${msg.room()}`)
    console.log("=============================")

    // 判断此消息类型是否为文本
    if (msg.type() == Message.Type.Text) {
      // 判断消息类型来自群聊
      if (msg.room()) {
        // 获取群聊
        const room = await msg.room()

        // 收到消息，提到自己
        if (await msg.mentionSelf()) {
          // 获取提到自己的名字
          let self = await msg.to()
          self = "@" + self.name()
          // 获取消息内容，拿到整个消息文本，去掉 @+名字
          let sendText = msg.text().replace(self, "")

          // 请求机器人接口回复
          let res = await requestRobot(sendText)

          // 返回消息，并@来自人
          room.say(res, msg.from())
          return
        }

        // 收到消息，没有提到自己  忽略
      } else {
        // 回复信息是关键字 “加群”
        if (await isAddRoom(msg)) return

        // 回复信息是所管理的群聊名
        if (await isRoomName(bot, msg)) return

        // 请求机器人聊天接口
        let res = await requestRobot(msg.text())
        // 返回聊天接口内容
        await msg.say(res)
      }
    } else {
      console.log("消息不是文本！")
    }
  }
}

export default bot;

/**
 * @description 回复信息是关键字 “加群” 处理函数
 * @param {Object} msg 消息对象
 * @return {Promise} true-是 false-不是
 */
async function isAddRoom(msg: any) {
  // 关键字 加群 处理
  if (msg.text() == "加群") {
    let roomListName = Object.keys(roomList)
    let info = `${name}当前管理群聊有${roomListName.length}个，回复群聊名即可加入哦\n\n`
    roomListName.map(v => {
      info += "【" + v + "】" + "\n"
    })
    msg.say(info)
    return true
  }
  return false
}

/**
 * @description 回复信息是所管理的群聊名 处理函数
 * @param {Object} bot 实例对象
 * @param {Object} msg 消息对象
 * @return {Promise} true-是群聊 false-不是群聊
 */
async function isRoomName(bot:any, msg:any) {
  // 回复信息为管理的群聊名
  if (Object.keys(roomList).some(v => v == msg.text())) {
    // 通过群聊id获取到该群聊实例
    const room = await bot.Room.find({ id: roomList[(msg.text())] })

    // 判断是否在房间中 在-提示并结束
    if (await room.has(msg.from())) {
      await msg.say("您已经在房间中了")
      return true
    }

    // 发送群邀请
    await room.add(msg.from())
    await msg.say("已发送群邀请")
    return true
  }
  return false
}

/**
 * @description 机器人请求接口 处理函数
 * @param {String} info 发送文字
 * @return {Promise} 相应内容
 */
function requestRobot(info: string) {
  console.log("the request info is "+info)
  return new Promise((resolve, reject) => {
    let url = `http://i.itpk.cn/api.php?question=${urlencode(info)}&api_key=xxxx&api_secret=xxxx`
    //这里去这个api网站itpk.cn登录注册一个就好
    request.get(url, (error, response, body) => {
      let sendStr:string = ""
      // console.log(response)
      if (!error && response.statusCode == 200) {
          if(body.indexOf("{") == -1){ 
            sendStr = body
            resolve(sendStr)
          }else{
            let res = JSON.stringify(body)
            res = res.substr(1)
            res = res.substr(0, res.length-1)
            if (res) {
              const reg = /\\/g
              let send = unescape(res.replace(/\u/g, '%u')); //unicode转中文
              send = send.replace(reg,''); //去转义，然后编辑字符串
              send = send.replace(/rn/g,'\\r\\n');
              send = send.trim()
              let sendObj = JSON.parse(send)
              if(sendObj.title){
                sendStr = "【标题】" + "\n" + JSON.stringify(sendObj.title)+ "\n"
              }
              sendStr = sendStr + "【内容】" + "\n" + JSON.stringify(sendObj.content).trim().substr(1).substr(0, res.length-1)
              console.log("the response send is "+ sendStr)
              // 免费的接口，所以需要把机器人名字替换成为自己设置的机器人名字
              resolve(sendStr)
          }
        } 
      }else {
          resolve("你在说什么，我脑子有点短路诶！")
        }
     })
  })
}




```

mRoomJoin.ts
```ts
// 配置文件
import config from "./config"

// 加入房间回复
const roomJoinReply = config.room.roomJoinReply
// 管理群组列表
const roomList = config.room.roomList

// 进入房间监听回调 room-群聊 inviteeList-受邀者名单 inviter-邀请者
const mRoomJoin = async (room: any, inviteeList:any[], inviter:any) => {
  // 判断配置项群组id数组中是否存在该群聊id
  if (Object.values(roomList).some(v => v == room.id)) {
    // let roomTopic = await room.topic()
    inviteeList.map(c => {
      // 发送消息并@
      room.say(roomJoinReply, c)
    })
  }    
}

export default mRoomJoin;

```

mScan.ts
```ts

import QrcodeTerminal from "qrcode-terminal"
import { ScanStatus } from 'wechaty-puppet'

const mScan = (qrcode:any, status:any) => {
    if (status === ScanStatus.Waiting) {
      QrcodeTerminal.generate(qrcode, {
        small: true
      }) 
  }
}

export default mScan;
```

mUser.ts
```ts 

const mUser = async (user: any) => {
 console.log(`user: ${JSON.stringify(user)}`)
        
}

export default mUser;
```

