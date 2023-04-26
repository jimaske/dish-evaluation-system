<script>
	import {
		onLaunch,
		onShow,
		onHide
	} from '@dcloudio/uni-app'
	import {
		useStore
	} from 'vuex'
	import {
		computed,
		watch
	} from 'vue'
	export default {
		setup() {
			const store = useStore()
			let token = computed(() => store.state.user.token)

			onLaunch(function() {
				if (token.value)
					getLoginStatus()
				// uni.$on('socket-message', function(data) {

				// });

				// getCurrentPages()[0].route
			})
			let msgFlag = computed(() => store.state.user.msgFlag)

			watch(msgFlag, (newValue) => {
				if (getCurrentPages().length > 0) {
					let pages = getCurrentPages();
					let route =pages[pages.length-1].route
					const regex = /^pages/;
					if (regex.test(route)) {
						if (msgFlag.value) {
							uni.showTabBarRedDot({
								index: 2
							})
						} else {
							uni.hideTabBarRedDot({
								index: 2
							});
						}
					}else{
						store.commit('user/setShowFlag', true)
					}
				}


			}, {
				immediate: true
			})
			onShow(function() {
				// console.log('App Show')
			})
			onHide(function() {
				// console.log('App Hide')
			})

			async function getLoginStatus() {

				const {
					data: res
				} = await uni.$http.get(`/loginStatus?token=${token.value}`)
				if (res.code === 200) {
					store.commit('user/setUserInfo', res.data.user)
					store.dispatch('user/initSocket', res.data.user.uid)
					// initSocket(userInfo.value.level)

				} else {
					uni.removeStorageSync('userInfo')
					uni.removeStorageSync('token');
					store.commit('user/setUserInfo', {})
					store.commit('user/setToken', null)
				}
			}
		}


	}
</script>

<style lang="scss">
	@import "/wxcomponents/dist/common/index.wxss";

	page {
		font-size: 3.6vw;
		background-color: #f5f5f5;
	}

	iamge {
		width: 100%;
		height: 100%;
	}
</style>