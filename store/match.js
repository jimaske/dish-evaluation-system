export default {
	namespaced: true,
	state: {
		mid: undefined,
		matchInfo: {},
		dishList: [],
		commentDishId:''
	},
	actions: {
		async getMatchDetail(context, value) {
			const {data:res} = await uni.$http.get(`/matchDetail?mid=${context.state.mid}`)
			 if (res.code == 200) {
				context.commit('setMatchInfo', res.data.match)
			}

		},
		async getMatchDishes(context, value) {
			const {
				data: res
			} = await uni.$http.get(`/matchDishes?mid=${context.state.mid}`)
			if (res.code == 200)
				context.commit('setDishList', res.data.dishList)
		},
		async getVotableNumber(context, value) {
			const {
				data: res
			} = await uni.$http.get(`/votableNumber?mid=${context.state.mid}`)
			if (res.code == 200)
				context.commit('setVotableNumber', res.data.votableNumber)
		}
	},
	mutations: {
		setMid(state, value) {
			state.mid = value
		},
		setMatchInfo(state, value) {
			state.matchInfo = null
			state.matchInfo = value
		},
		setDishList(state, value) {
			state.dishList = null
			state.dishList = value
		},
		setVotableNumber(state, value){
			if(value>=0){
				let tem={...state.matchInfo}
				tem.votableNumber=value
				state.matchInfo=null
				state.matchInfo = tem
			}
		},
		setCommentDishId(state, value){
			console.log(value);
			state.commentDishId=value
		}
		
	},
	getters: {



	}
}
