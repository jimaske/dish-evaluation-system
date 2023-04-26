<template>
	<view>
		<van-dialog id="van-dialog" />
		<van-toast id="van-toast" />
		<van-tabs sticky :active="active" title-active-color="#4d80de">
			<van-tab title="比赛">
				<van-collapse accordion :value="activeName" @change="onChange">
					<van-collapse-item name="1">
						<view slot="title">默认收藏夹({{starList.length}})</view>
						<navigator class="star-item" v-for="item in starList" :key="item.mid"
							:url="`../match_detail/match_detail?mid=${item.mid}`">
							<view class="left-content">
								<image class="matchImg" :src="item.posterUrl" mode=""></image>
							</view>
							<view class="right-content">
								<view class="title">{{item.title}}</view>
								<view class="time">
									<van-icon name="calendar-o" size="16px" /> {{item.startTime}} 至 {{item.endTime}}
								</view>
								<view class="info">
									<view class="match-info">
										<view class="like-count">
											<image class="vote-icon" src="../../static/vote-gray-icon.png" mode="">
											</image>{{item.voteCount}}
										</view>
										<view class="comment-count">
											<van-icon name="good-job-o" size="16px" />{{item.commentCount}}
										</view>

									</view>
									<view class="delete-btn" type="default" :data-mid="item.mid"
										@click.stop="deleteStar">
										<van-icon name="cross" size="20px" />
									</view>
									<!--  -->
								</view>
							</view>
						</navigator>
					</van-collapse-item>
				</van-collapse>
			</van-tab>
		</van-tabs>

	</view>
</template>

<script>
	import {
		onLoad,
		onShow,
	} from '@dcloudio/uni-app'
	import {
		ref
	} from 'vue'
	import {
		Dialog
	} from '/wxcomponents/vant/dialog/dialog';
	import {
		Toast
	} from '/wxcomponents/vant/toast/toast';
	export default {

		setup() {
			let active = ref(0)
			let activeName = ref("1")

			function onChange(event) {
				activeName.value = event.detail
			}

			let starList = ref([])
			async function getStarList() {
				const {
					data: res
				} = await uni.$http.get("/starList")
				if (res.code === 200) {
					let temStarList=[...res.data.starList]
					temStarList.forEach((item) => {
						item.startTime = uni.$dayjs(item.startTime).format('YYYY-MM-DD')
						item.endTime = uni.$dayjs(item.endTime).format('YYYY-MM-DD')
					})
					starList.value = temStarList
				}
			}
			onLoad(() => {
				getStarList()
			})
			
			async function reqDeleteStar(mid) {
				const {
					data: res
				} = await uni.$http.post("/cancelStarMatch", {
					mid
				})
				if (res.code === 200) {
					getStarList()
					Toast({
						type: 'success',
						message: '删除成功',
						duration: 1000,
					});
				} else
					Toast({
						type: 'fail',
						message: '删除失败',
						duration: 1000,
					});
			}

			function deleteStar(e) {
				if (e.target.dataset.mid)
					Dialog.confirm({
						title: '',
						message: '确认删除该收藏',
					})
					.then(() => {
						reqDeleteStar(e.target.dataset.mid)
					})
					.catch(() => {
						// on cancel
					});
			}
			return {
				active,
				activeName,
				onChange,
				starList,
				deleteStar
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

	.star-item {
		display: flex;
		padding: 15rpx;

		.left-content {
			width: 250rpx;
			height: 160rpx;
			margin-right: 15rpx;

			// flex-shrink: 0;
			.matchImg {
				width: 100%;
				height: 100%;
				border-radius: 8rpx;
			}
		}

		.right-content {
			flex: 1;

			.title {
				font-size: 30rpx;
				color: #000;
				height: 3em;
			}

			.info {
				display: flex;
				justify-content: space-between;

				.match-info {
					display: flex;

					.like-count {
						width: 120rpx;
					}
				}

				.vote-icon {
					width: 28rpx;
					height: 28rpx;
				}

				.delete-btn {
					position: relative;

					&::before {
						position: absolute;
						content: '';
						left: 0;
						top: 0;
						right: 0;
						bottom: 0;
						z-index: 2;
					}
				}
			}
		}

	}
</style>
