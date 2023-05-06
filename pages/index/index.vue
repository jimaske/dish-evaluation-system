<template>
	<view class="home">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="item in swiper" :key="item.mid">
				<navigator class="swiper-item" :url="`../../subpkg/match_detail/match_detail?mid=${item.mid}`">
					<!-- <image :src="item.url" mode=""></image> -->
					<van-image width="100%" height="100%" :src="item.url" />
				</navigator>

			</swiper-item>
		</swiper>
		<view class="common-use">
			<view class="title">常用功能</view>
			<view class="navList">
				<view class="winners">
					<image src='../../static/navlist1.jpg' mode="scaleToFill"></image><text>Top1系列</text>
				</view>
				<view class="tops">
					<image src='../../static/navlist4.jpg' mode="scaleToFill"></image><text>社区交流</text>
				</view>
			</view>
		</view>

		<view class="comment">
			<text class="title">每周讨论</text>
			<view class="comment-content">
				<view class="comment-left">
					<text>{{weekComment.title}}</text>
					<div class="row-button">
						<button type="default">{{weekComment.optionFirstText}}
							<text>({{weekComment.optionFirstCount}})</text></button>
						<button
							type="default">{{weekComment.optionSecondText}}<text>({{weekComment.optionSecondCount}})</text></button>
					</div>

				</view>
				<view class="comment-right">
					<image :src="weekComment.imgUrl" mode=""></image>
				</view>
			</view>
		</view>
		<view class="dailyRec">
			<text class="title">每日推荐</text>
			<image class="foodImg" :src="weekRecommend.foodImgUrl" mode=""></image>
			<view class="dailyRe-content">
				<view class="detail">
					<text class="name">{{weekRecommend.foodName}}</text>
					<text class="adr">地址：{{weekRecommend.address}}</text>
				</view>
				<view class="food-recommend">
					<text class="recommend-text">“{{weekRecommend.recommendText}}”</text>
				</view>
			</view>

		</view>
	</view>

</template>

<script>
	import {
		onLoad,
		onShow,
		onPullDownRefresh,
		onReachBottom
	} from '@dcloudio/uni-app'
	import {
		reactive,
		ref
	} from "vue"
	import {reqGetHome} from '../../api/index.js'
	export default {
		setup() {
			let swiper = ref([])
			let weekComment = ref({})
			let weekRecommend = ref({})
			async function getHomeInfo() {
				const {
					data: res
				} = await reqGetHome()
				//请求失败
				if (res.code !== 200) return uni.$showMsg(res.message)
				else {
					swiper.value = res.data.swiper
					weekComment.value = res.data.weekComment
					weekRecommend.value = res.data.weekRecommend
				}
			}
			onLoad(() => {
				getHomeInfo()
			})
			return {
				swiper,
				weekComment,
				weekRecommend
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home {
		padding-bottom: 20rpx;
	}

	swiper {
		height: 330rpx;
		margin-bottom: 20rpx;

		.swiper-item {
			width: 100%;
			height: 100%;
		}

	}

	.common-use {
		.title {
			font-size: 34rpx;
			padding: 0 15rpx;
			margin-bottom: 10rpx;
			font-weight: 600;
		}

		.navList {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 0 15rpx;

			&>view {
				position: relative;
				width: 49%;
				height: 170rpx;
				margin-bottom: 15rpx;
				color: #fff;
				text-align: center;
				overflow: hidden;

				image {
					width: 100%;
					height: 130rpx;
					border-radius: 10rpx;
				}

				text {
					font-size: 32rpx;
					position: relative;
					line-height: 30rpx;
					color: #333;
				}
			}

		}
	}


	.comment {
		box-sizing: border-box;
		height: 300rpx;
		margin: 10rpx 15rpx 25rpx;
		padding: 10rpx 20rpx;
		background-color: #2d77e6;
		border-radius: 10rpx;

		.title {
			position: relative;
			font-size: 32rpx;
			font-weight: 600;
			color: #fff;
			z-index: 1;

			&::before {
				content: '';
				position: absolute;
				top: 28rpx;
				left: 0;
				width: 125rpx;
				height: 15rpx;
				background-color: #dd9819;
				z-index: -1;
			}
		}

		.comment-content {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.comment-left {
				width: 46%;
				display: flex;
				flex-direction: column;

				text {
					font-size: 28rpx;
					color: #fff;
					margin-bottom: 15rpx;
					letter-spacing: 2rpx;
				}

				.row-button {
					display: flex;
					justify-content: space-between;

					button {
						height: 50rpx;
						font-size: 24rpx;
						padding: 5rpx 15rpx;
						background-color: #ff991a;
						color: #24458e;
						line-height: 40rpx;
						border-radius: 23rpx;
						font-weight: 600;
						margin: 0;

						text {
							font-size: 20rpx
						}
					}
				}

			}

			.comment-right {
				width: 51%;

				image {
					width: 320rpx;
					height: 200rpx;
					border: 15rpx solid #fff;
					border-radius: 5rpx;
				}
			}
		}

	}

	.dailyRec {
		position: relative;
		box-sizing: border-box;
		margin: 0 15rpx;
		height: 350rpx;
		border-radius: 10rpx;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			// background-color: rgba(0, 0, 0, .5);
			background-image: linear-gradient(to top, #222, transparent); //过渡效果
		}

		.title {
			position: absolute;
			top: 10rpx;
			left: 15rpx;
			color: #eee;
			z-index: 1;
			font-weight: 600;
		}

		.foodImg {
			width: 100%;
			height: 100%;
		}

		.dailyRe-content {
			position: absolute;
			bottom: 10rpx;
			left: 15rpx;
			right: 15rpx;
			color: #fff;

			.detail {
				display: flex;
				justify-content: space-between;
				align-items: center;

				margin-bottom: 10rpx;

				.name {
					font-size: 40rpx;
					letter-spacing: 3rpx;
				}

				.adr {
					font-size: 26rpx;
					letter-spacing: 5rpx;
					color: #eee;
				}
			}

			.food-recommend {
				padding: 15rpx 0;
				color: #cecece;
			}
		}
	}
</style>