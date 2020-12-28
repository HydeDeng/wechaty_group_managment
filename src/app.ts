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