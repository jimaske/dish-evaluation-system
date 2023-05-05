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
					store.dispatch('user/getLoginStatus')
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

		}


	}
</script>

<style lang="scss">
	@import "/wxcomponents/vant/common/index.wxss";

	page {
		font-size: 3.6vw;
		background-color: #f5f5f5;
	}

	iamge {
		width: 100%;
		height: 100%;
	}
</style>