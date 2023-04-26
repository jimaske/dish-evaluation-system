<template>
	<view class="vote-content" @click="voteOrComment">
		<view class="addDish" @click="addDish" v-if="userInfo.status==1">
			<van-icon name="add-o" color="#888" size="32rpx" /> 新增参赛作品
		</view>
		<view class="vote-item" :class="{voted:item.voteFlag}" v-for="(item,index) in dishList" :key="item.id">
			<view class="content-left">
				<image class="foodPicture" :src="item.imgUrl" mode=""></image>
			</view>
			<view class="content-center">
				<view class="title"><text class="title-text">{{item.dishName}}</text>
					<text class="add-text">({{item.address}})</text>
					<text v-if="item.label" class="title-tab">{{item.label}}</text>
				</view>
				<view class="dishDescription">
					<text class="dishDescription-text">{{item.dishDescription}}</text>
				</view>
				<view class="user-comment" v-if="item.hotComment!=''">
					<!-- <image class="user-avl" src="../../static/logo.png" mode=""></image> -->
					<text class="comment-text">{{"“"+item.hotComment+"”"}}</text>
				</view>
			</view>
			<view class="content-right">
				<view class="vote" v-if="userInfo.status!=2&&userInfo.status!=1" :data-vote="[item.did,index]">
					<button class="vote-btn" type="default" plain>
						<image class="vote-icon" src="../../static/vote-icon.png"></image>
					</button>
					<text class="voteCount-text">{{item.voteCount}}</text>
				</view>
				<view v-else class="edit" :data-edit="item.did">
					<button class="edit-btn" type="default" plain>
						<image class="edit-icon" src="../../static/edit3.png"></image>
					</button>
				</view>
				<view class="comment" v-if="userInfo.status!=2&&userInfo.status!=1" :data-comment="item.did">
					<button class="comment-btn" type="default" plain>
						<image class="comment-icon" src="../../static/comment-icon.png" mode=""></image>
					</button>
					<text class="voteCount-text">{{item.commentCount}}</text>
				</view>
				
				<view v-else class="delete" :data-delete="item.did">
					<button class="delete-btn" type="default" plain>
						<image class="delete-icon" src="../../static/delete.png"></image>
					</button>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		useStore
	} from "vuex";
	import {
		computed,
		nextTick,
		getCurrentInstance,
		watch,
		ref
	} from "vue";
	import {
		Toast
	} from '/wxcomponents/vant/toast/toast';
	import {
		Dialog
	} from '/wxcomponents/vant/dialog/dialog';
	import {
		onLoad
	} from '@dcloudio/uni-app'

	export default {
		name: "vote-dish",
		props: ["votableNumber"],
		emits: ["toComment", "setSwiperHeight", "editDish"],
		setup(props, context) {
			const store = useStore();

			let userInfo = computed(() => store.state.user.userInfo)

			let dishList = computed(() => store.state.match.dishList);

			let _this = getCurrentInstance();

			watch(dishList, (newValue) => {
				// console.log(newValue);
				nextTick(() => {
					let query = uni.createSelectorQuery().in(_this);
					query.select(".vote-content").boundingClientRect(res => {
						if (res && res.height != 0) {
							// 	swiperHeight.value = res.height;
							context.emit("setSwiperHeight", res.height)
						}
					}).exec();
				})
			}, {
				immediate: true
			})

			async function voteDish(did) {
				const {
					data: res
				} = await uni.$http.post("/voteDish", {
					did
				})
				if (res.code === 200) {
					store.dispatch('match/getMatchDishes')
					store.dispatch('match/getVotableNumber')

					Toast({
						type: 'success',
						message: '投票成功',
						duration: 1000,
					});
				}

			}

			function voteOrComment(e) {

				if (e.target.dataset.vote) {
					let did = e.target.dataset.vote[0]
					let index = e.target.dataset.vote[1]
					if (props.votableNumber <= 0) {
						Toast({
							type: 'fail',
							message: '票数已投完',
							duration: 1000,
						});
					} else if (dishList.value[index].voteFlag != true) {
						Dialog.confirm({
								title: '',
								message: '确定给该作品投票吗',
							})
							.then(() => {
								voteDish(did)
							})
							.catch(() => {
								// on cancel
							});
					} else {
						Toast({
							type: 'fail',
							message: '投票重复',
							duration: 1000,
						});
					}
				} else if (e.target.dataset.comment) {
					let did = e.target.dataset.comment
					store.commit('match/setCommentDishId', did)
					context.emit("toComment")
				} else if (e.target.dataset.edit) {
					//打开参赛作品信息编辑框
					let did = e.target.dataset.edit
					context.emit("editDish", did)
				} else if (e.target.dataset.delete) {
					let did = e.target.dataset.delete
					Dialog.confirm({
							title: '',
							message: '确定永久删除该作品？',
						})
						.then(async () => {
							const {
								data: res
							} = await uni.$http.post('/deleteDish', {
								did
							})
							console.log(res);
							if (res.code === 200) {
								store.dispatch('match/getMatchDishes')
								Toast({
									type: 'success',
									message: '删除成功',
									duration: 1000
								});
							}
						})
						.catch(() => {
							// on cancel
						});
				}
			}

			function addDish() {
				context.emit("editDish")
			}


			return {
				dishList,
				voteOrComment,
				userInfo,
				addDish
			};
		}
	}
</script>

<style lang="scss" scoped>
	.vote-content {
		padding: 35rpx 25rpx 0;
		transition: 0.3s;

		.addDish {
			height: 80rpx;
			background-color: #ccc;
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			line-height: 80rpx;
			text-align: center;
			color: #666;
		}

		.vote-item.voted {
			box-shadow: -2px 0px 3px -1px #1bb520 inset;

			.vote-btn {
				background-color: #c5c5c547;
			}
		}

		.vote-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 250rpx;
			padding: 0 30rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			transition: 0.3s;

			.content-left {
				.foodPicture {
					width: 180rpx;
					height: 180rpx;
					border-radius: 15rpx;
				}

			}

			.content-center {
				display: flex;
				flex-direction: column;
				width: 55%;
				height: 70%;

				.title {
					display: flex;
					align-items: center;
					font-weight: 600;
					margin-bottom: 25rpx;

					.title-text {
						font-size: 34rpx;
					}

					.add-text {
						font-size: 28rpx;
						color: #555;
						font-weight: 400;
					}

					.title-tab {
						margin-left: 10rpx;
						padding: 5rpx 8rpx;
						font-weight: 400;
						font-size: 22rpx;
						background-color: #ff7534;
						color: #fff;
						border-radius: 8rpx;
					}
				}

				.dishDescription {
					font-size: 26rpx;
					color: #555;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-bottom: 25rpx;
				}

				.voteNum {
					font-size: 24rpx;
					color: #333;
					margin-bottom: 20rpx;
				}

				.user-comment {
					display: flex;
					align-items: center;
					margin-bottom: 15rpx;
					padding: 3rpx 0;
					background-color: #feed9f;

					.user-avl {
						width: 30rpx;
						height: 30rpx;
						border-radius: 50%;
					}

					.comment-text {
						font-size: 26rpx;
						color: #d58e23;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}

			.content-right {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				width: 13%;
				height: 95%;

				.vote,
				.comment,
				.edit,
				.delete {
					position: relative;
					text-align: center;
					font-size: 26rpx;
					color: #848484;
					font-weight: 600;

					&::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						bottom: 0;
						right: 0;
						z-index: 1;
					}
				}

				.vote-btn,
				.comment-btn,
				.edit-btn,
				.delete-btn {
					position: relative;
					width: 70rpx;
					height: 70rpx;
					line-height: 90rpx;
					border-radius: 50%;
					padding: 0;
					border: 1px solid #d8d8d8;

					.vote-icon,
					.comment-icon,
					.edit-icon,
					.delete-icon {
						width: 80%;
						height: 80%;
					}

				}
			}
		}
	}
</style>
