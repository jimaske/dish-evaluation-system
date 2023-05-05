<template>
	<view class="match-comment" ref="userComment">

		<view @click="changeLinkComment" class="linkLabel">
			<text class="text" :class="{active:commentDishId===''}" :data-did="''">全部</text>
			<text class="text" v-for="item in dishList" :class="{active:commentDishId===item.did}" :key="item.did"
				:data-did="item.did">#{{item.dishName}}</text>
		</view>
		<view class="comment-box" @click="likeOrComment" v-if="commentList.length!=0">
			<view class="user-comment" v-for="item in commentList" :key="item.cid">
				<view class="user-info">
					<image class="user-avl" :src="item.avatarUrl" mode=""></image>
					<text class="user-name">{{item.userName}}</text>
					<text v-if="item.ownFlag">(我)</text>
					<!-- <text class="user-label">资深评友</text> -->
				</view>
				<view class="commentFood" v-if="item.linkFlag">
					评价作品：{{item.linkDishName}}（{{item.linkDishAddress}}）
				</view>
				<view class="comment-content">
					{{item.commentContent}}
				</view>
				<view class="comment-info">
					<text class="comment-date">{{item.releaseTime}}发布</text>
					<view class="btns">
						<view class="like btn" :data-like="item.cid">
							<van-icon name="good-job" color="#1288ff" size="5vw" v-if="item.likeFlag" />
							<van-icon name="good-job-o" size="5vw" v-else />
							<text class="likeCount">{{item.likeCount}}</text>
						</view>
						<view class="delete btn" v-if="item.ownFlag" :data-delete="item.cid">
							<van-icon name="delete-o" size="5vw" />
						</view>

					</view>
				</view>
			</view>
		</view>
		<view class="noComment comment-box" v-else>
			暂时没有相关评论
		</view>


	</view>

</template>

<script>
	import {
		computed,
		ref,
		watch,
		onMounted,
		onUpdated,
		nextTick,
		getCurrentInstance,
		reactive,
		defineComponent
	} from "vue";
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		useStore
	} from 'vuex'
	import {
		releaseTime
	} from "../../utils/time.js"
	import {
		Toast
	} from '/wxcomponents/vant/toast/toast';
	import {
		Dialog
	} from '/wxcomponents/vant/dialog/dialog';
	export default defineComponent({
		name: "match-comment",
		props: ["noCommentFirstShow", "commentTop"],
		emits: ["setSwiperHeight", "getCommentTop"],
		setup(props, context) {
			let userInfo = uni.getStorageSync('userInfo')
			const store = useStore()

			let _this = getCurrentInstance();

			let userComment = ref(null)

			let dishList = computed(() => store.state.match.dishList)
			let commentDishId = computed(() => store.state.match.commentDishId)
			let commentDishName = ref('')



			function changeLinkComment(e) {
				if (e.target.dataset.did || e.target.dataset.did === '') {
					store.commit('match/setCommentDishId', e.target.dataset.did)
				}
			}

			let commentList = ref([])
			let mid = computed(() => store.state.match.mid)

			async function getMatchComments(did) {

				const {
					data: res
				} = await uni.$http.get(`/matchComments?mid=${mid.value}&did=${did}`)
				if (res.code == 200) {
					console.log((res.data));
					if (res.data.commentList.length != 0) {
						commentList.value = res.data.commentList.map((item, index) => {
							item.releaseTime = releaseTime(item.createTime)
							return item
						})
						console.log(commentList.value);
					} else {
						commentList.value = []
					}
					await nextTick(() => {
						let query = uni.createSelectorQuery().in(_this);
						query.select(".match-comment").boundingClientRect(res => {
							if (res && res.height != 0) {
								// 	swiperHeight.value = res.height;
								context.emit("setSwiperHeight", res.height)
							}
						}).exec();
					})
					return
				}
			}
			watch(() => props.noCommentFirstShow, async (newValue) => {
				if (newValue) { //如果是第一次显示
					console.log(commentDishId.value);
					await getMatchComments(commentDishId.value)
					scrollTop()
				}
			})

			function scrollTop() {
				//每次切换不同的参赛作品时候，向下滑一定的高度
				uni.pageScrollTo({ //让页面返回顶部，方便获取位置数据
					scrollTop: 0,
					duration: 0
				});
				const query = uni.createSelectorQuery().in(_this);
				let bottom, top, height = 0
				query.selectAll('.user-comment').boundingClientRect(data => {
					if (data.length > 0) {
						if (data.length > 1)
							height = data[0].height
						bottom = data[0].bottom
						if (bottom) {
							let scrollTop = Math.round(bottom - props.commentTop +
								height / 2)
							setTimeout(() => {
								uni.pageScrollTo({
									scrollTop,
									duration: 0
								});
							})
						}
					} else { //如果评论区没有评论
						uni.pageScrollTo({
							scrollTop: 190,
							duration: 0
						});
					}

				}).exec();

			}
			watch(commentDishId, async (newVal) => {
				let commentDish = dishList.value.find(item => item.id == newVal)
				if (commentDish)
					commentDishName.value = commentDish.dishName
				else
					commentDishName.value = ''
				await getMatchComments(newVal)
				scrollTop()

			})

			function likeOrComment(e) {
				if (e.target.dataset.like)
					like(e.target.dataset.like)
				else if (e.target.dataset.delete)
					deleteComment(e.target.dataset.delete)
			}
			async function deleteComment(cid) {
				Dialog.confirm({
						title: '',
						message: '确定删除该评论？',
					})
					.then(async () => {
						const {
							data: res
						} = await uni.$http.post('/deleteComment', {
							cid
						})
						getMatchComments(commentDishId.value)
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
				//根据isLike属性判断用户是点赞还是取消点赞
				if (commentList.value[commentIndex].likeFlag) {
					const {
						data: res
					} = await uni.$http.post('/cancelCommentLike', {
						cid
					})
					getMatchComments(commentDishId.value)
				} else {
					const {
						data: res
					} = await uni.$http.post('/commentLike', {
						cid
					})
					getMatchComments(commentDishId.value)
				}
			}


			return {
				commentList,
				dishList,
				changeLinkComment,
				getMatchComments,
				like,
				likeOrComment,
				commentDishId,
				userComment,
				commentDishName,
				userInfo
			};
		}
	})
</script>

<style lang="scss" scoped>
	.match-comment {
		min-height: 300rpx;
		padding: 20rpx 20rpx 100rpx;
		margin: 30rpx 0;
		background-color: #f8f8f8;
		border-radius: 20rpx;
	}

	.linkLabel {
		margin-bottom: 20rpx;

		.text {
			display: inline-block;
			margin: 10rpx 12rpx;
			padding: 10rpx 18rpx;
			border-radius: 6rpx;
			background-color: #e6e6e6;
			white-space: nowrap;


		}

		.active {
			background-color: #d8954a;
			color: #fff;
		}
	}

	.noComment {
		padding: 80rpx;
		text-align: center;
		color: #b3b3b3;
	}

	.user-comment {
		margin-bottom: 30rpx;
	}

	.user-info,
	.commentFood {
		margin-bottom: 15rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.user-name {
		font-size: 34rpx;
		font-weight: 600;
		margin-right: 15rpx;
	}

	.user-avl {
		width: 60rpx;
		height: 60rpx;
		margin-right: 15rpx;
		border-radius: 50%;
	}

	.user-label {
		padding: 2rpx 6rpx;
		background-color: #e96f2e;
		border-radius: 4rpx;
		font-size: 24rpx;
		color: #fff;
		letter-spacing: 2rpx;
	}

	.commentFood {
		position: relative;
		padding-left: 15rpx;
		color: #949494;

		&::before {
			position: absolute;
			left: 0;
			top: 0;
			content: '';
			height: 100%;
			width: 4rpx;
			background-color: #cdcdcd;
		}
	}

	.comment-content {
		margin-bottom: 20rpx;
		font-size: 4vw;
	}

	.comment-info {
		display: flex;
		justify-content: space-between;

		.comment-date {
			font-size: 26rpx;
			color: #a3a3a3;
		}

		.btns {
			display: flex;
		}

		.btn {
			position: relative;
			display: flex;
			align-items: center;
			height: 40rpx;
			margin-left: 15rpx;
			font-size: 26rpx;
			color: #a3a3a3;


			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 1;
			}
		}

		.btn-icon {
			width: 40rpx;
			height: 40rpx;
		}

		.likeCount {
			padding-left: 5rpx;
		}
	}
</style>
