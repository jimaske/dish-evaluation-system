export default {
	namespaced: true,
	state: {
		token:uni.getStorageSync('token') || null,
		redirectInfo:null,
		userInfo:{},
	},
	actions: {
		async getMatchDetail(context, value) {
			const {data:res} = await uni.$http.get(`/matchDetail?mid=${context.state.mid}`)
			 if (res.code == 200) {
				context.commit('setMatchInfo', res.data.match)
			}
		}
	},
	mutations: {
		setToken(state,value){
			state.token=value;
		},
		setUserStatus(state,value){
			state.userStatus=value;
		},
		setRedirectInfo(state,value){
			state.redirectInfo=value
		},
		setUserInfo(state,value){
			state.userInfo=value
		},
		setAvatar(state,value){
			let userInfo={...state.userInfo}
			userInfo.avatarUrl=value
			state.userInfo=userInfo
		}
	},
	getters: {



	}
}