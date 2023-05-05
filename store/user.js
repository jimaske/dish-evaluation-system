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
					// let url=`ws://127.0.0.1:8080/ws/${uid}`
					let url = `ws://127.0.0.1:4000?uid=${uid}`
					context.state.socketObj = new WebSocketClass({
						url,
						time: 60,
						callback: (data) => {
							context.commit('updateMsgNumList', data)
							data.time = Date.now()
							context.state.msgList.unshift(data)
							uni.setStorageSync('msgList', context.state.msgList)
							context.state.msgFlag = true
						}
					})
					context.state.socketObj.initSocket()
				}
			}
		},
		closeSocket(context, uid) {
			if (context.state.socketObj && context.state.socketObj.isConnect) {
				context.state.socketObj.closeSocket()
				context.state.socketObj=null
			}
		},
		async getLoginStatus(context) {
			const {
				data: res
			} = await uni.$http.get(`/loginStatus?token=${context.state.token}`)
			if (res.code === 200) {
				context.commit('setUserInfo', res.data)
				context.dispatch('initSocket', res.data.uid)
				// initSocket(userInfo.value.level)
			} else {
				uni.removeStorageSync('userInfo')
				uni.removeStorageSync('token');
				context.commit('setUserInfo', {})
				context.commit('setToken', null)
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
			}else{
				state.msgNumList.likeList = 0
				state.msgNumList.voteList = 0
				state.msgNumList.commentList = 0
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