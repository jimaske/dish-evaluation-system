<template>
	<view class="match-content">
		<image class="match-bg" :src="matchInfo.posterUrl" mode="aspectFill"></image>
		<view class="match-text">
			<view class="content-top">
				<view class="match-title">
					<text class="title">{{matchInfo.title}}</text>
					<image class="icon" src="../../static/hot.png" mode=""></image>
				</view>
				<view class="overdue" v-if="matchInfo.isOverdue">
					<text class="text">{{matchInfo.deadlineText}}</text>
				</view>
				<view class="match-time" v-else>
					<text class="day">{{matchInfo.day}}</text> 天 
					<text class="hour">{{matchInfo.hour}}</text> 时 
					<text class="min">{{matchInfo.min}}</text> 分截止
				</view>
			</view>
			<view class="match-intro">
				比赛内容：{{matchInfo.matchDescription}}
			</view>
			<view class="hot">
				<view class="hot-left">
					<image class="hot-icon" src="../../static/hot-fill.png"></image>
					<image class="hot-icon" src="../../static/hot-fill.png"></image>
				</view>
				<view class="participantsNumber">共有{{matchInfo.totalDishes}}种参赛菜品</view>
			</view>
			<view class="sponsor">
				<text class="text">主办方：{{matchInfo.matchCreator}}</text>
				<button v-if="!matchInfo.isStar" class="collect-btn" size="mini" @click="starMatch">添加收藏</button>
				<button v-else class="collected-btn" size="mini" @click="cancelStarMatch">已收藏</button>
			</view>
			<view class="match-preview">
				<view class="title">排名速览 <text class="tip">(根据当前票数实时更新)</text></view>
				<view class="preview-content" v-if="temDishList.length>0">
					<view class="item top2" v-if="temDishList[1]">
						<view class="foodImgBox">
							<image class="food-img" :src="temDishList[1].imgUrl" mode=""></image>
							<image class="icon" src="../../static/topicon2.png" mode=""></image>
						</view>
						<view class="food-name">{{temDishList[1].dishName}}</view>
						<view class="voteNum">{{temDishList[1].voteCount}}票</view>
					</view>
					<view class="item top1" v-if="temDishList[0]">
						<view class="foodImgBox">
							<image class="food-img" :src="temDishList[0].imgUrl" mode=""></image>
							<image class="icon" src="../../static/topicon1.png" mode=""></image>
						</view>
						<view class="food-name">{{temDishList[0].dishName}}</view>
						<view class="voteNum">{{temDishList[0].voteCount}}票</view>
					</view>
					<view class="item top3" v-if="temDishList[2]">
						<view class="foodImgBox">
							<image class="food-img" :src="temDishList[2].imgUrl" mode=""></image>
							<image class="icon" src="../../static/topicon3.png" mode=""></image>
						</view>
						<view class="food-name">{{temDishList[2].dishName}}</view>
						<view class="voteNum">{{temDishList[2].voteCount}}票</view>
					</view>
				</view>
				<view class="noDish" v-else>
					暂无参赛作品
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {Toast} from '/wxcomponents/dist/toast/toast';
	import {countDown} from "../../utils/time.js"
	import {
		useStore
	} from "vuex";
	import {
		computed,
		watch,
		ref
	} from "vue";
	export default {
		name: "match-info",
		setup() {
			const store = useStore();
			let matchInfo = computed(() =>store.state.match.matchInfo);
			let dishList = computed(() => store.state.match.dishList);
			let temDishList = ref([])
			watch(dishList, (neV) => {
				temDishList.value = [...neV].sort((a, b) => b.voteCount - a.voteCount).slice(0, 3);
			},{immediate:true,deep:true})
			watch(matchInfo, (neV) => {
				const date=countDown(neV.endTime)
				if(date.isOverTime){
					neV.deadlineText='活动已结束'
					neV.isOverdue=true
				}else{
					neV.day=date.day
					neV.hour=date.hour
					neV.min=date.min
				}
			},{deep:true})
			
			async function starMatch() {
				const {
					data: res
				} = await uni.$http.post(`/starMatch`, {
					mid: matchInfo.value.id
				})
				if(res.code==200){
					store.dispatch('match/getMatchDetail')
					Toast({
					  type: 'success',
					  message: '收藏成功',
					  duration:1500,
					});
				}
				
			}
				
			async function cancelStarMatch(){
				const {
					data: res
				} = await uni.$http.post(`/cancelStarMatch`, {
					mid: matchInfo.value.id
				})
				console.log(res);
				if(res.code==200){
					store.dispatch('match/getMatchDetail')
					Toast({
					  type: 'success',
					  message: '取消收藏',
					  duration:1500,
					});
				}
			}
			return {
				matchInfo,
				temDishList,
				starMatch,
				cancelStarMatch
			};
		}
	}
</script>

<style lang="scss" scoped>
	.match-content {
		margin-bottom: 25rpx;
		background-color: #fefefe;
		overflow: hidden;

		.match-bg {
			position: relative;
			width: 100%;
			height: 250rpx;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				top: 85%;
				left: 0;
				bottom: 0;
				right: 0;
				background-image: linear-gradient(to top, #fefefe, transparent); //过渡效果
			}
		}

		.match-text {
			padding: 0 20rpx;

			.content-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				.overdue .text{
					font-size: 30rpx;
					color: #a9a9a9;
					font-weight: 400;
				}
				.match-title {
					.icon {
						width: 45rpx;
						height: 45rpx;
					}
					
					.title {
						font-size: 34rpx;
						font-weight: 600;
						vertical-align: top;
						padding-right: 5rpx;
					}
				}

				.match-time {
					font-size: 22rpx;
					color: #333;
					vertical-align: middle;
					font-weight: 600;

					.day,
					.hour,
					.min {
						display: inline-block;
						width: 30rpx;
						height: 30rpx;
						line-height: 30rpx;
						text-align: center;
						border: 1px solid #999;
						border-radius: 5rpx;
					}

				}
			}

			.match-intro {
				font-size: 28rpx;
				letter-spacing: 2rpx;
				margin-bottom: 20rpx;
			}

			.hot {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.hot-left {
					.foodNum {
						padding-left: 10rpx;
						font-size: 24rpx;
						color: #333;
					}

					.hot-icon {
						width: 30rpx;
						height: 30rpx;
					}
				}

				.participantsNumber {
					font-size: 24rpx;
					color: #d90000;
					padding-right: 5rpx;
				}

			}

			.sponsor {
				font-size: 24rpx;
				padding-bottom: 20rpx;
				border-bottom: 1px solid #cecece;
				margin-bottom: 10rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.text {
					font-size: 28rpx;
				}

				.collect-btn {
					margin: 0;
					border-radius: 50rpx;
					font-size: 24rpx;
					background-color: #d88b2c;
					color: #fff;
				}

				.collected-btn {
					margin: 0;
					border-radius: 50rpx;
					font-size: 24rpx;
					background-color: #daa767;
					color: #FFF;
				}
			}

			.match-preview {
				padding-bottom: 20rpx;
				.title {
					font-size: 34rpx;
					font-weight: 600;
					color: darkred;
					margin: 15rpx 0;

					.tip {
						font-size: 26rpx;
						font-weight: 400;
						color: #666;
					}
				}

				.preview-content {
					display: flex;
					justify-content: space-around;
					.top1 .food-img{
						width: 220rpx;
						height: 220rpx;
					}
					.top2 .food-img{
						width: 205rpx;
						height: 205rpx;
						margin-top: 15rpx;
					}
					.top3 .food-img{
						width: 190rpx;
						height: 190rpx;
						margin-top: 30rpx;
					}
					
					.item {
						position: relative;
						// width: 200rpx;
						height: 280rpx;
						overflow: hidden;
						border-radius: 15rpx;
						text-align: center;
						.foodImgBox{
							position: relative;
							// width: 220rpx;
							height: 220rpx;
						}
						
						.food-img {
							position: relative;
							border-radius: 15rpx;

							&::before {
								content: '';
								position: absolute;
								top: 50%;
								left: 0;
								bottom: 0;
								right: 0;
								background-image: linear-gradient(to top, #000, transparent); //过渡效果
							}
						}

						.icon {
							position: absolute;
							left: 50%;
							transform: translate(-50%);
							bottom: 10rpx;
							width: 60rpx;
							height: 60rpx;
						}

						.food-name {
							font-size: 26rpx;
							font-weight: 600;
						}

						.voteNum {
							font-size: 24rpx;
							color: #333;
						}
					}
				}
			}
			.noDish{
				color: #888;
				text-align: center;
				line-height: 2;
			}
		}

	}
</style>
