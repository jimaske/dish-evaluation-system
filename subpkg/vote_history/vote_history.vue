<template>
	<view class="vote-history">
		<van-tabs sticky :active="active" title-active-color="#4d80de">
			<van-tab title="比赛">
				<view class="history-box" v-for="dateItem in voteList" :key="dateItem.date">
					<view class="date-text">
						{{dateItem.date}}
					</view>
					<view class="history-content">
						<navigator class="history-item" v-for="historyItem in dateItem.List" :key="historyItem.id"
							:url="`../match_detail/match_detail?mid=${historyItem.id}`">
							<view class="left-content">
								<image class="matchImg" :src="historyItem.imgUrl" mode=""></image>
							</view>
							<view class="right-content">
								<view class="title">{{historyItem.matchName}}</view>

								<view class="vote-info">
									<image class="vote-icon" src="../../static/vote-gray-icon.png" mode=""></image>
									票投给了<text class="dishName" v-for="dishNameItem in historyItem.dishName"
										:key="dishNameItem"> {{dishNameItem}} </text>
								</view>
								<view class="vote-time">
									<van-icon name="calendar-o" size="16px" /> {{dateItem.date+" "+historyItem.time}}
								</view>
							</view>
						</navigator>
					</view>
				</view>
			</van-tab>
		</van-tabs>
	</view>
</template>

<script>
	import {
		ref
	} from 'vue'
	export default {
		setup() {
			let active = ref(0)
			let activeName = ref("1")

			function onChange(event) {
				activeName.value = event.detail
			}
			let voteList = ref([])
			async function getVoteHistory() {
				const {
					data: res
				} = await uni.$http.get("/voteHistoryList")
				if (res.code === 200) {
					let temVoteHistoryList = [...res.data.historyList]
					let dateList = []
					temVoteHistoryList.sort((a, b) => b.voteTime - a.voteTime)
					temVoteHistoryList.forEach((item) => {
						let date
						let todayUnix = uni.$dayjs().startOf('date').valueOf()
						let voteDayUnix = uni.$dayjs(item.voteTime).startOf('date').valueOf()
						if (todayUnix === voteDayUnix)
							date = "今天"
						else if (todayUnix - voteDayUnix === 86400000)
							date = "昨天"
						else
							date = uni.$dayjs(item.voteTime).format('YYYY-MM-DD')

						item.time = uni.$dayjs(item.voteTime).format('HH:mm')
						let dateIndex = dateList.findIndex((object) => object.date === date)
						if (dateIndex == -1)
							dateList.push({
								date,
								List: [item]
							})
						else
							dateList[dateIndex].List.push(item)
					})
					voteList.value = dateList
				}
			}
			getVoteHistory()
			return {
				active,
				activeName,
				onChange,
				voteList
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

	.history-box {
		background-color: #fff;

		.date-text {
			font-size: 30rpx;
			padding: 25rpx 15rpx;
			font-weight: 600;
			color: #3e3e3e;
		}
	}


	.history-item {
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

			.vote-time {
				color: #888;
			}

			.vote-info {
				color: #888;
			}

			.vote-icon {
				width: 28rpx;
				height: 28rpx;
			}

			.dishName {
				color: #946565;
				font-size: 28rpx;
				padding: 0 5rpx;
				font-weight: 600;
			}
		}
	}
</style>
