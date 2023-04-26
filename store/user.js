import WebSocketClass from '../utils/webSocket.js'
export default {
	namespaced: true,
	state: {
		token: uni.getStorageSync('token') || null,
		redirectInfo: null,
		userInfo: {},
		msgList: uni.getStorageSync('msgList') || [],
		socketObj: undefined,
		msgFlag: false,
		msgNumList: {
			likeList: 0,
			commentList: 0,
			voteList: 0,
			dishList: 0
		},
		showFlag:false
		// newMsgList:uni.getStorageSync('msgList') || []
	},
	actions: {
		async getMatchDetail(context, value) {
			const {
				data: res
			} = await uni.$http.get(`/matchDetail?mid=${context.state.mid}`)
			if (res.code == 200) {
				context.commit('setMatchInfo', res.data.match)
			}
		},
		initSocket(context, uid) { // uid => 用户id
			if (uid) {
				if (context.state.socketObj) {
					// 如果sockt实例未连接
					if (context.state.socketObj.isConnect) {
						context.state.socketObj.initSocket()
					}
				} else {
					// 如果没有sockt实例，则创建
					// let url=`ws://127.0.0.1:8080/${uid}`
					let url = `ws://127.0.0.1:4000?uid=${uid}`
					context.state.socketObj = new WebSocketClass({
						url,
						time: 60,
						callback: (data) => {
							context.commit('updateMsgNumList', data)
							data.time = Date.now()
							context.state.msgList.unshift(data)
							// uni.$emit("socket-message",data)
							uni.setStorageSync('msgList', context.state.msgList)
							// data.isNew=true

							// context.state.newMsgList.push(data)
							context.state.msgFlag = true
						}
					})
					context.state.socketObj.initSocket()
				}
			}
		}
	},
	mutations: {
		setToken(state, value) {
			state.token = value;
		},
		setUserStatus(state, value) {
			state.userStatus = value;
		},
		setRedirectInfo(state, value) {
			state.redirectInfo = value
		},
		setUserInfo(state, value) {
			state.userInfo = value
		},
		setAvatar(state, value) {
			let userInfo = {
				...state.userInfo
			}
			userInfo.avatarUrl = value
			state.userInfo = userInfo
		},
		setMsgList(state, value) {
			state.msgList = value
		},
		setMsgFlag(state) {
			state.msgFlag = false
		},
		updateMsgNumList(state, data) {
			if (data.messageType === 1) {
				state.msgNumList.likeList++
			} else if (data.messageType === 2) {
				state.msgNumList.commentList++
			} else if (data.messageType === 3) {
				state.msgNumList.voteList++
			} else if (data.messageType === 4 || data.messageType === 5) {
				state.msgNumList.dishList++
			}
		},
		setMsgNumList(state, index) {
			if (index == 0) {
				state.msgNumList.likeList = 0
				state.msgNumList.voteList = 0
			} else if (index == 1) {
				state.msgNumList.commentList = 0
			} else if (index == 2) {
				state.msgNumList.dishList = 0
			}
			let sum = 0
			for (let i in state.msgNumList) {
				sum += state.msgNumList[i]
			}
			if(sum==0)
				state.msgFlag = false
		},
		setShowFlag(state, value){
			state.showFlag=value
		}
	},
	getters: {
		getMsgNum: state => {
			let sum = 0
			for (let i in state.msgNumList) {
				sum += state.msgNumList[i]
			}
			return sum
		}
	}
}