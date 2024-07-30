/**
 * 发布订阅 - 群聊
 * 发布者：群 id
 * 订阅者：人（群聊中的其他人）
 */
const getManager = (() => {
  let manager = null
  return function() {
    if(!manager){
      manager = createManager()
    }
    return manager
  }
})()

const createManager = () => {
  const map = {}
  const subscribe = ({member, room}) => {
    ChatRoom.checkRoom(room)
    Member.checkMember(member)

    const roomId = room.id
    if(!map[roomId]){
      map[roomId] = []
    }
    map[roomId].push(member)
    console.log(member.name, '@', member.id, 'join the room ', roomId)

    // 取消订阅 unsubscribe
    return () => {
      map[roomId] = map[roomId].filter(m => m.id !== member.id)
      console.log('OUT: ', member.id, 'leave the room ', roomId)
    }
  }

  const dispatch = ({room, message, member, members = []}) => {
    ChatRoom.checkRoom(room)
    Member.checkMember(member)

    const roomId = room.id
    if(!map[roomId]){
      throw 'there is not a room number ' + roomId
    }

    const temp = members.reduce((res, id) => {
      res[id] = true
      return res
    }, {})

    map[roomId].forEach(m => {
      if(m.id === member.id){
        return
      }
      m.notify({roomId, message, member, isSpecified: Boolean(members.length && temp[m.id])})
    })
  }

  const cancel = room => {
    delete map[room.id]
    console.log('room', room.id, 'has been canceled')

  }

  const register = room => {
    return {
      subscribe: function(data){
        return subscribe({...data, room})
      },
      dispatch: function(data){
        return dispatch({...data, room})
      }
    }
  }

  return {
    subscribe,
    dispatch,
    cancel,
    register
  } 
}

const getId = () => Math.round(Math.random() * 100000)

const ChatRoom = function() {
  this.id = getId()
  this.name = '默认名称'
}

ChatRoom.checkRoom = function(room){
  if(!room?.id){
    throw 'invalid room'
  }

  return true
}

const Member = function(name){
  this.name = name
  this.id = getId()
}

Member.prototype.notify = function({message, member, isSpecified}){
  console.log(this.name, 'recieved message: ', message, 'from ', member.name, isSpecified && 'isSpecified')
}

Member.checkMember = function(member){
  if(!member?.id){
    throw 'invalid member'
  }
  return true
}

/**
 * message* 消息内容
 * member* 发信人
 * room 消息所在聊天室
 */
const Message = function() {
  const item = {}
  const checkMessage = () => {
    if(!item.message){
      throw 'message instance not set message'
    }
    if(!item.member){
      throw 'message instance not set member'
    }
    return true
  }

  this.setMember = function(member){
    Member.checkMember(member)
    this.member = member
  }
  this.setMessage = function(message){
    this.message = message
  }
  this.setRoom = function(room){
    this.room = room
  }
  this.getMessage = function(){
    checkMessage()
    return item
  }
}

const {cancel, register} = getManager()
// 创建 成员
const member1 = new Member('member1')
const member2 = new Member('member2')
const member3 = new Member('member3')

/**
 * 多人聊天室
 */
const testMultiRoom = () => {
  // 创建 群聊
  const room1 = new ChatRoom()
  const {subscribe, dispatch} = register(room1)
  // 加入群聊
  const unsub1 = subscribe({member: member1})
  const unsub2 = subscribe({member: member2})
  const unsub3 = subscribe({member: member3})

  // 发送消息
  dispatch({message: 'message1', member: member1, members: [member2.id]})
  dispatch({message: 'message2', member: member2})

  // 退出群聊
  unsub1()

  // 发送消息
  dispatch({message: 'message2', member: member2})

  // 加入群聊
  const reUnSub1 = subscribe({member: member1})
}

/**
 * 单聊聊天室 
*/ 
const singleRoom = (m1, m2) => {
  const room2 = new ChatRoom('member1&member2')
  const {subscribe, dispatch} = register(room2)
  subscribe({member: m1})
  subscribe({member: m2})

  // 解散
  return {
    unSub: () => {
      cancel(room2)
    },
    sendMessage: dispatch
  }
}

const testSingleRoom = () => {
  const {unSub, sendMessage} = singleRoom(member1, member2)
  /**
   * 创建消息
   */
  const message1 = new Message()
  message1.setMessage('xxx to member2')
  message1.setMember(member1)

  // test message
  sendMessage(message1)
  // 向对方发送消息
  sendMessage({member: member2, message: 'xxx to member1'})

  // 解散单聊
  unSub()

  // 再次向对方发送消息，应该抛出异常
  // sendMessage({member: member1, message: 'xxx to member2'})
}

// test case 1
testMultiRoom()
// test case 2
testSingleRoom()
