<template>
	<view class="match" ref="match">
		<van-dialog id="van-dialog" />

		<view class="match-box" style="">
			<van-sticky :offset-top="0">
				<van-search use-action-slot @search="onSearch" @change="onChange" placeholder="请输入搜索关键词">
					<view slot="action" @tap="onClick">搜索</view>
				</van-search>
			</van-sticky>
			<scroll-view scroll-y="true" class="scroll-container" id="scrollContainer" @scroll="handleScroll">
				<view :style="blankFillStyle">
					<navigator v-for="(item,index) in showDataList" :key="item.mid" hover-class="none"
						:url="`../../subpkg/match_detail/match_detail?mid=${item.mid}`" class="matchItem">
						<view class="main-content">
							<image class="matchImg" :src="item.posterUrl" mode=""></image>
							<view class="content-middle">
								<view class="match-title"><text class="title">{{item.title}}</text><text class="type"
										v-if="userInfo.status!=2">{{item.matchKind}}</text>
								</view>

								<view class="time" v-if="userInfo.status===0&&item.isOverdue">
									<text>{{item.deadlineText}}</text>
								</view>
								<view class="time" v-else-if="userInfo.status===0&&!item.isOverdue">
									<text>距结束: </text><text class="day">{{item.day}}</text> 天 <text
										class="hour">{{item.hour}}</text> 时 <text class="min">{{item.min}}</text> 分
								</view>
								<view class="time" v-else>
									<text>日期: </text><text>{{timeFormat(item.startTime)}}</text> 至
									<text>{{timeFormat(item.endTime)}}</text>
								</view>
								<view class="kind" v-if="userInfo.status===2">
									<text class="kindText">{{item.matchKind}}</text>
								</view>
								<view class="participants-number" v-if="userInfo.status===2">
									{{"投票/"+item.totalVotes+"&nbsp;&nbsp;&nbsp;评论/"+item.totalComments}}
								</view>
								<view class="participants-number" v-else>已有{{item.totalVotes}}人参与评比</view>
								<view>
									<text class="honor"
										v-if="item.labelKind!=0&&userInfo.status==0">{{item.labelText}}</text>
								</view>

								<view class="user-comment" v-if="userInfo.status!=2">
									<view class="comment-text">{{item.hotCommond}}</view>
								</view>

							</view>
							<view class="content-right btns" v-if="userInfo.status===2&&kind==2"
								@click.stop="editOrDelete">

								<view class="edit" :data-edit="item.mid">
									<image class="edit-icon" src="../../static/edit2.png" mode=""></image>
								</view>
								<view class="delete" :data-delete="item.mid">
									<van-icon size="50rpx" color="#f76861" name="close" />
								</view>

							</view>
						</view>
					</navigator>
				</view>
			</scroll-view>
		</view>
		<view class="dishListKind" v-if="userInfo.status===2" @click="switchMatchList">
			<view class="kind" :data-kind="2" :class="{active:kind==2}">
				我创建的
			</view>
			<view class="kind" :data-kind="0" :class="{active:kind==0}">
				全部
			</view>
		</view>




		<view class="noSearchResult" v-if="noMatchFlag">
			<image class="noSearchResultImg" src="../../static/searchNoResult.png" mode=""></image>
			<text class="noSearchResultText">没有结果，换个关键词试试</text>
		</view>
	</view>
</template>

<script>
	import {
		onLoad,
		onShow,
		onPullDownRefresh,
		onReachBottom,
	} from '@dcloudio/uni-app'
	import {
		ref,
		computed,
		reactive,
		onMounted,
		getCurrentInstance
	} from "vue"
	import {
		useStore
	} from 'vuex'
	import {
		countDown
	} from "../../utils/time.js"
	import throttle from "../../utils/throttle.js"
	import {
		Dialog
	} from '/wxcomponents/dist/dialog/dialog';
	export default {
		setup() {
			let _this = getCurrentInstance();
			let query = uni.createSelectorQuery().in(_this);


			onShow(async() => {
				userInfo.value = uni.getStorageSync('userInfo') //更新用户状态
				kind.value = userInfo.value.status
				matchList.value =await getMatchList()||[]
				if (matchList.value.length>0){
					noMatchFlag.value = true
				} 
				else noMatchFlag.value = false
				getContainSize()
			})


			const store = useStore()
			let userInfo = ref(uni.getStorageSync('userInfo'))

			let kind = ref(userInfo.value.status)

			function switchMatchList(e) {
				if (typeof e.target.dataset.kind === 'number') {
					kind.value = e.target.dataset.kind
					getMatchList()
				}
			}

			let searchName = ref('')
			async function onSearch(e) {
				// Toast('搜索' + searchName.value);
				searchName.value = e.detail.trim()
				getMatchList()

			}

			function onChange(e) {
				searchName.value = e.detail
			}
			async function onClick() {
				getMatchList()
			}

			let matchList = ref([{}])

			let noMatchFlag = ref(false)

			//格式化比赛数据列表
			function formatMatchList(matchList) {
				let list = JSON.parse(JSON.stringify(matchList))
				list.forEach((match) => {
					const date = countDown(match.endTime)
					if (date.isOverTime) {
						match.deadlineText = '活动已过期'
						match.isOverdue = true
					} else {
						match.day = date.day
						match.hour = date.hour
						match.min = date.min
					}
					if (match.labelKind === 0)
						match.labelText = ''
					else if (match.labelKind === 1)
						match.labelText = '近期投票最多'
					else if (match.labelKind === 2)
						match.labelText = '近期评论最多'
					else if (match.labelKind === 3)
						match.labelText = '近期收藏最多'
				})
				return list
			}
			async function getMatchList() {
				visualData.isRequestStatus = true;
				return uni.$http.get(`/matches?searchName=${searchName.value}&userStatus=${kind.value}`)
					.then((res) => {
						if (res.data.code === 200) {
							visualData.isRequestStatus = false;
							let list = res.data.data.matchList
							if (userInfo.value.status == 0)
								list = formatMatchList(list)
							return list;
						} else{
							uni.$showMsg(res.message)
							return false
						}
							
					}).catch((err) => {
						console.log(err);
						uni.$showMsg(err)
						return false;
					});


			}

			function timeFormat(time) {
				if (typeof time === 'number' && time > 0)
					return uni.$dayjs(time).format('YYYY-MM-DD')
				else return false
			}

			function editOrDelete(e) {
				// console.log(e.target);
				let dataset = e.target.dataset
				if (dataset != {}) {
					if (dataset.edit) {
						uni.navigateTo({
							url: `/subpkg/add_Match/add_Match?mid=${dataset.edit}`
						})
					} else if (dataset.delete) {
						Dialog.confirm({
								title: '',
								message: '确定永久删除该比赛？',
							})
							.then(async () => {
								const {
									data: res
								} = await uni.$http.post('/deleteMatch', {
									mid: dataset.delete
								})
								if (res.code === 200) {
									getMatchList()
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

			}

			let visualData = reactive({
				isRequestStatus: false,
				containSize: 0,
				currentIndex: 0,
				oneHight: 145,
				isScrollStatus: true,
				scheduledAnimationFrame: false,
				//记录当前滚动的距离顶部的位移
				currentScrollTop: 0
			})
			let endIndex = computed(() => {
				let index = visualData.currentIndex + 2 * visualData.containSize;
				if (!matchList.value[index]) {
					index = matchList.value.length - 1;
				}
				return index;
			})
			let startIndex = computed(() => {
				if (visualData.currentIndex <= visualData.containSize) return 0;
				else return visualData.currentIndex - visualData.containSize;
			})
			let showDataList = computed(() => {
				return matchList.value.slice(startIndex.value, endIndex.value);
			})
			let blankFillStyle = computed(() => {
				// console.log(startIndex.value,matchList.value.length - endIndex.value);
				return {
					paddingTop: startIndex.value * visualData.oneHight + "px",
					paddingBottom: (matchList.value.length - endIndex.value) * visualData.oneHight + "px",
				};
			})
			const scrollContainer = ref(null)
			const match = ref(null)

			function getContainSize() {
				query.select("#scrollContainer").boundingClientRect(res => {
					if (res && res.height != 0) {
						visualData.containSize =
							Math.floor(res.height / visualData.oneHight) + 2;
					}
				}).exec();
			}

			async function setStartIndex(e) {
				visualData.currentScrollTop = e.detail.scrollTop
				visualData.currentIndex = ~~(e.detail.scrollTop / visualData.oneHight);
				// console.log(visualData.currentIndex,visualData.containSize,matchList.value.length - 1)
				// console.log(visualData.currentIndex, visualData.containSize, matchList.value.length - 1);
				//屏幕滚动到底部发送请求
				if (
					visualData.currentIndex + visualData.containSize > matchList.value.length - 1 &&
					!visualData.isRequestStatus
				) {
					console.log("滚动到底部，发送请求");
					let list = await getMatchList();
					if (list) matchList.value.push(...list);
					console.log(matchList.value.length);
				}
			}
			// function handleScroll(){
			// 	console.log(1);
			// }
			let handleScroll = throttle(setStartIndex, 30)
			return {
				onSearch,
				onChange,
				onClick,
				kind,
				searchName,
				matchList,
				noMatchFlag,
				userInfo,
				timeFormat,
				editOrDelete,
				switchMatchList,
				blankFillStyle,
				scrollContainer,
				match,
				handleScroll,
				showDataList
			}
		}
	}
</script>

<style lang="scss" scoped>
	.match {
		overflow-y: hidden;
		height: 100vh;

		.match-box {
			display: flex;
			flex-direction: column;
			height: 100%;
		}
	}

	.dishListKind {
		display: flex;
		padding: 15rpx 15rpx 0;

		.kind {
			padding: 5rpx 15rpx;
			background-color: #fff;
			margin-right: 20rpx;
			border: 1px solid #dedede;
			border-radius: 8rpx;
			color: #555;
		}

		.kind.active {
			border: 1px solid #0054e0;
			color: #0563d8;
		}
	}

	.scroll-container {
		height: 100%;
		overflow-y: auto;
	}

	.matchItem {
		margin: 15px 15rpx 0;
		padding: 15rpx 20rpx 10rpx;
		background-color: #fff;
		border-radius: 15rpx;
		height: 130px;
		box-sizing: border-box;

		.main-content {
			display: flex;
			justify-content: space-around;
			height: 100%;

			.matchImg {
				flex-shrink: 0;
				width: 220rpx;
				height: 165rpx;
				border-radius: 8rpx;
			}

			.content-middle {
				flex: 1;
				width: 0;
				margin-left: 15rpx;
				display: flex;
				flex-direction: column;
				height: 100%;
				justify-content: space-between;

				.match-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;

					.title {
						color: #d2691e;
						font-size: 4vw;
					}

					.type {
						padding-right: 10rpx;
						font-size: 3.2vw;
						color: #d24f1d;
						font-weight: 400;
					}
				}

				.time {
					font-size: 26rpx;
					color: #333;
					vertical-align: middle;
					margin-bottom: 10rpx;

					.day,
					.hour,
					.min {
						display: inline-block;
						width: 32rpx;
						height: 32rpx;
						line-height: 32rpx;
						text-align: center;
						border: 1px solid #999;
						border-radius: 5rpx;
					}

				}

				.participants-number {
					font-size: 22rpx;
					color: #545454;
					margin-bottom: 10rpx;
				}

				.honor {
					padding: 2rpx 15rpx;
					font-size: 26rpx;
					background-color: #ffcb89b8;
					color: #cc7402;
					border-radius: 5rpx;
				}

				.user-comment {
					display: flex;
					align-items: center;
					margin-top: 10rpx;

					.user-avl {
						width: 30rpx;
						height: 30rpx;
						border-radius: 50%;
						margin-right: 5rpx;
						vertical-align: middle;
					}

					.comment-text {
						font-size: 3.5vw;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						color: #000;
					}
				}

				.kind {
					margin-bottom: 10rpx;
					font-size: 26rpx;

					.kindText {
						padding: 3rpx 12rpx;
						color: #b26e19;
						background-color: #ffeaa7;
						border-radius: 8rpx;
					}
				}

			}

			.content-right {
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.edit-icon {
					width: 50rpx;
					height: 50rpx;
				}

				.edit,
				.delete {
					position: relative;

					&::after {
						position: absolute;
						content: '';
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
					}
				}
			}
		}
	}

	.noSearchResult {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 100rpx;

		.noSearchResultText {
			font-size: 36rpx;
			color: #666;
		}

		.noSearchResultImg {
			width: 60%;
		}
	}

	.addMatch {
		position: fixed;
		bottom: 8%;
		right: 8%;
		background-color: #fff;
		border-radius: 50%;
		z-index: 2;
		box-shadow: 0px 0px 4px 0px #686868;
	}
</style>