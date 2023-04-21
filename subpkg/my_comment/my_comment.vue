<template>
	<view>
		<van-dialog id="van-dialog" />
		<van-tabs sticky :active="active" title-active-color="#4d80de">
			<van-tab title="比赛">
				<view class="comment-box" @click="likeOrComment">
					<view class="comment-item" v-for="item in commentList" :key="item.id">
						<view class="user-info">
							<view class="left-content">
								<image class="avatar" :src="userInfo.avatarUrl" mode=""></image>
							</view>
							<view class="right-content">
								<view class="userName">{{userInfo.userName}}</view>
								<view class="time">
									{{item.releaseTime}}
								</view>
							</view>
						</view>
						<view class="comment-content">
							{{item.commentContent}}
						</view>
						<view class="bottom-content">
							<navigator class="matchName" :url="`../match_detail/match_detail?mid=${item.mid}`">
								{{item.matchName}}<text class="dishName" v-if="item.dishName!=''">-{{item.dishName}}
								</text>
								<van-icon custom-style="border: 1px solid #ad3718;margin-left: 8rpx;" name="guide-o" />
							</navigator>
							<view class="button-box">
								<view class="like btn" :data-like="item.cid">
									<van-icon size="6vw" :info="item.likeCount" custom-style="margin-right:16rpx;"
										color="#1271ff" v-if="item.isLiked" name="good-job" />
									<van-icon size="6vw" :info="item.likeCount" custom-style="margin-right:16rpx;"
										v-else name="good-job-o" />
								</view>
								<view class="delete btn" :data-delete="item.cid">
									<van-icon size="6vw" name="delete-o" />
								</view>
							</view>

						</view>
					</view>
				</view>
			</van-tab>
		</van-tabs>
	</view>
</template>

<script>
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		ref,
		computed
	} from 'vue'
	import {
		useStore
	} from 'vuex';
	import {
		Dialog
	} from '/wxcomponents/dist/dialog/dialog';
	import {
		Toast
	} from '/wxcomponents/dist/toast/toast';
	export default {
		setup() {
			const store = useStore()

			let active = ref(0)
			let activeName = ref("1")

			function onChange(event) {
				activeName.value = event.detail
			}

			let userInfo = computed(() => store.state.user.userInfo)

			let commentList = ref([])
			async function getCommentList() {
				const {
					data: res
				} = await uni.$http.get("/myCommentList")
				if (res.code === 200) {
					let temCommentList = [...res.data.commentList]
					temCommentList.sort((a, b) => b.time - a.time)
					temCommentList.forEach((item) => {
						item.releaseTime = uni.$dayjs(item.time).format('YYYY-MM-DD HH:mm')
					})
					commentList.value = temCommentList
				}
			}
			getCommentList()
			onShow(() => {
				getCommentList()
			})
			async function deleteComment(cid){
				Dialog.confirm({
						title: '',
						message: '确定删除该评论？',
					})
					.then(async() => {
						const {
							data: res
						} = await uni.$http.post('/deleteComment', {
							cid
						})
						getCommentList()
						Toast({
							type: 'success',
							message: '删除成功',
							duration: 1000
						});
					})
					.catch(() => {
						// on cancel
					});
			}
			async function like(cid) {
				let commentIndex = commentList.value.findIndex((item, index) => {
					return item.cid === cid
				})
				//根据isLiked属性判断用户是点赞还是取消点赞
				if (commentList.value[commentIndex].isLiked) {
					const {
						data: res
					} = await uni.$http.post('/cancelCommentLike', {
						cid
					})
					
					getCommentList()
				} else {
					const {
						data: res
					} = await uni.$http.post('/commentLike', {
						cid
					})
					getCommentList()
				}
			}
			function likeOrComment(e){
				if (e.target.dataset.like)
					like(e.target.dataset.like)
				else if (e.target.dataset.delete)
					deleteComment(e.target.dataset.delete)
			}
			
			
			return {
				active,
				activeName,
				onChange,
				commentList,
				userInfo,
				likeOrComment
			}
		}
	}
</script>

<style lang="scss">
	.van-tab {
		width: 120rpx;
		flex: none !important;
		font-size: 28rpx
	}

	.van-tabs__line {
		background-color: #4d80de !important;
	}

	.van-collapse-item__content {
		padding: 0 !important;
	}

	.like .van-info {
		background-color: transparent;
		color: #888;
		right: -2px;
	}

	.comment-box {
		padding: 20rpx;
	}

	.comment-item {
		padding: 20rpx;
		margin: 20rpx 0;
		background-color: #fff;
		border-radius: 10rpx;

		.user-info {
			display: flex;
		}

		.right-content {
			margin-left: 20rpx;
		}

		.avatar {
			width: 70rpx;
			height: 70rpx;
			border-radius: 8rpx;
		}

		.userName {
			font-weight: 600;
		}

		.time {
			font-size: 24rpx;
			color: #888;
		}

		.comment-content {
			padding: 20rpx 0;
			font-size: 28rpx;
		}

		.bottom-content {
			display: flex;
			justify-content: space-between;
		}

		.matchName {
			background-color: #ffd6ae;
			padding: 8rpx 15rpx;
			border-radius: 6rpx;
			color: #b95814;
		}
		.button-box{
			display: flex;
			
			.btn{
				position: relative;
				margin-left: 15rpx;
				&::before{
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 2;
				}
			}
		}
	}
</style>
