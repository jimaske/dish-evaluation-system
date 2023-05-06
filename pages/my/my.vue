<template>
	<view class="person-page">
		<view class="content-top">
			<view class="top-bg">
				<image src="../../static/person_bg.jpg" mode=""></image>
			</view>
			<view class="user-info" v-if="token">
				<view class="flex-left">
					<image class="user-avatar" :src="userInfo.avatarUrl" mode=""></image>
				</view>
				<view class="flex-right">
					<view class="user-name">{{userInfo.userName}}
						<view v-if="userInfo.status===2" class="manager-flag">
							<van-icon size="3.5vw" name="manager-o" /><text class="flag-text"
								style="font-size: 24;">管理员</text>
						</view>
						<text class="user-level" v-if="userInfo.status===0">Lv{{userInfo.level}}</text>
					</view>
					<view class="user-saying">{{userInfo.signature}}</view>
				</view>
			</view>
			<view class="noLogin user-info" v-else>
				<view class="flex-left">
					<image class="user-avatar" src="../../static/user-avatar1.png" mode=""></image>
				</view>
				<view class="flex-right">
					<view class="user-name" style="color: #dcdcdc;">你还没有登录，<view
							style="display: inline-block;color: #fff;" @tap="toLogin">点击登录/注册</view>
					</view>
				</view>
			</view>
			<view class="info-list" @click="isLogin">
				<view data-url="../../subpkg/my_star/my_star" v-if="userInfo.status===0" class="listItem my-collect">
					<image class="collect-icon" src="../../static/my-collect.png" mode=""></image>
					<text>我的收藏</text>
				</view>
				<view data-url="../../subpkg/vote_history/vote_history" v-if="userInfo.status===0"
					class="listItem vote-history">
					<image class="collect-icon" src="../../static/vote-history.png" mode=""></image>
					<text>投票历史</text>
				</view>
				<view data-url="../../subpkg/my_comment/my_comment" v-if="userInfo.status===0"
					class="listItem my-comment">
					<image class="collect-icon" src="../../static/my-comments.png" mode=""></image>
					<text>我的评论</text>
				</view>
				<view data-url="../../subpkg/add_Match/add_Match" v-if="userInfo.status===2" class="listItem add-Match">
					<image class="collect-icon" src="../../static/newMatch.png" mode=""></image>
					<text>创建比赛</text>
				</view>
				<view data-url="../../subpkg/my_comment/my_comment" v-if="userInfo.status!=0"
					class="listItem my-comment">
					<image class="collect-icon" src="../../static/data.png" mode=""></image>
					<text>比赛可视化</text>
				</view>
			</view>
		</view>

		<view class="content-bottom" @click="isLogin">
			<view class="user-item" data-url="../../subpkg/edit_profile/edit_profile">
				<view class="item-left">
					<image class="item-icon" src="../../static/edit.png" mode=""></image>
					<text class="item-name">编辑资料</text>
				</view>
				<view class="item-right">
					<image class="rightArrow" src="../../static/rightArrow.png" mode=""></image>
				</view>
			</view>
			<view class="user-item" data-url="../../subpkg/my_message/my_message">
				<view class="item-left">
					<image class="item-icon" src="../../static/my-message.png" mode=""></image>
					<text class="item-name">我的消息</text>
				</view>
				<view class="item-right">
					<text class="badge" v-if="msgNum>0">{{msgNum}}</text>
					<image class="rightArrow" src="../../static/rightArrow.png" mode=""></image>
				</view>

			</view>
			<view class="user-item">
				<view class="item-left">
					<image class="item-icon" src="../../static/feedback.png" mode=""></image>
					<text class="item-name">意见反馈</text>
				</view>
				<view class="item-right">
					<image class="rightArrow" src="../../static/rightArrow.png" mode=""></image>
				</view>
			</view>
			<view class="user-item" v-if="token" @click="logout">
				<view class="item-left">
					<image class="item-icon" src="../../static/setting.png" mode=""></image>
					<text class="item-name">退出登录</text>
				</view>
				<view class="item-right">
					<image class="rightArrow" src="../../static/rightArrow.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {reqLogout} from '../../api/index.js'
	import {
		onLoad,
		onShow,

	} from '@dcloudio/uni-app'
	import {
		computed,
		ref,
		watch
	} from 'vue'
	import {
		useStore
	} from 'vuex'

	export default {
		setup() {
			const store = useStore()
			let token = computed(() => store.state.user.token)
			let userInfo = computed(() => store.state.user.userInfo)

			function toLogin() {
				uni.navigateTo({
					url: "/subpkg/login/login",
					success: function() {
						store.commit('user/setRedirectInfo', {
							openType: 'switchTab',
							from: '/pages/my/my'
						})
					}
				})
			}

			let msgNumber = ref(0)
			onLoad(() => {
				// 监听事件
				uni.$on('socket-message', function(data) {
					if (Array.isArray(data)) {
						msgNumber.value = data.length
					} else {
						if (Array.isArray(data)) {
							uni.setTabBarBadge({
								index: 2,
								text: '1'
							})
						}
					}
				});
			})

			async function logout() {
				const {
					data: res
				} = await reqLogout()
				if (res.code == 200) {
					uni.removeStorageSync('token');
					uni.removeStorageSync('userInfo');
					store.commit('user/setUserInfo', {})
					store.commit('user/setToken', null)
					store.dispatch('user/closeSocket')
					store.commit('user/setMsgNumList', -1)
				}
			}

			function isLogin(e) {
				if (!token.value) {
					toLogin()
				} else {
					if (e.target.dataset.url) {
						uni.navigateTo({
							url: e.target.dataset.url
						})
					}
				}
			}

			let msgFlag = computed(() => store.state.user.msgFlag)

			let showFlag = computed(() => store.state.user.showFlag)
			onShow(() => {
				if (showFlag.value) {
					if (msgFlag.value) {
						uni.showTabBarRedDot({
							index: 2
						})
					} else {
						uni.hideTabBarRedDot({
							index: 2
						});
					}
				}
			})

			let msgList = computed(() => store.state.user.msgList)
			let msgNum = computed(() => store.getters['user/getMsgNum'])

			watch(msgList, (newValue) => {
				console.log(newValue);
			})

			return {
				token,
				toLogin,
				userInfo,
				isLogin,
				logout,
				msgNumber,
				msgList,
				msgNum

			}
		}
	}
</script>

<style lang="scss" scoped>
	.badge {
		display: inline-block;
		padding: 0 20rpx;
		background-color: red;
		border-radius: 100px;
		color: #fff;
	}

	.content-top {
		position: relative;
		height: 350rpx;

		.top-bg {
			width: 100%;
			height: 350rpx;

			image {
				width: 100%;
				height: 350rpx;
			}
		}

		.user-info {
			position: absolute;
			top: 15%;
			left: 5%;
			display: flex;
			align-items: center;
			z-index: 1;

			.user-avatar {
				width: 120rpx;
				height: 120rpx;
				border: 5rpx solid #efefef;
				border-radius: 50%;
			}

			.flex-right {
				margin-left: 20rpx;

				.user-name {
					font-size: 34rpx;
					color: #fff;
					margin-bottom: 10rpx;

					.manager-flag {
						.flag-text {
							// font-weight: 700;
							font-size: 28rpx;
						}
					}

					.user-level {
						padding-left: 15rpx;
						font-size: 24rpx;
						color: #efefef;
					}
				}

				.user-saying {
					font-size: 26rpx;
					color: #e6e6e6;
				}
			}
		}

		.info-list {
			position: absolute;
			top: 70%;
			left: 0;
			right: 0;
			display: flex;
			justify-content: space-around;
			height: 140rpx;
			background-color: #fff;
			margin: 0 20rpx;
			padding: 30rpx 0;
			border-radius: 20rpx;
			box-shadow: 0rpx 2rpx 6px -1rpx #1d9aff;

			.listItem {
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				&::before {
					position: absolute;
					content: '';
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 2;

				}

				image {
					width: 70rpx;
					height: 70rpx;
				}

				text {
					font-size: 28rpx;
				}
			}
		}

	}

	.content-bottom {
		margin-top: 125rpx;
		padding: 0 20rpx;

		.user-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 86rpx;
			border-bottom: 1px solid #eaeaea;

			.item-left {
				display: flex;
				align-items: center;
				width: 50%;

				.item-icon {
					width: 50rpx;
					height: 50rpx;
					padding-right: 15rpx;
				}

				.item-name {
					font-size: 28rpx;
					color: #333;
				}

			}

			.item-right {
				display: flex;
				align-items: center;

				.rightArrow {
					width: 40rpx;
					height: 40rpx;
				}
			}

		}
	}
</style>