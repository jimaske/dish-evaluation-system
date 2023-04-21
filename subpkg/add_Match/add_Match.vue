<template>
	<view class="addMatchPage">
		<van-toast id="van-toast" />
		<van-notify id="van-notify" />
		<view class="top">
			<view class="left">
				<view class="match-title input">
					<text class="label">题&nbsp;&nbsp;&nbsp;&nbsp;目：</text> <input class="text_input" type="text"
						v-model="match.title" placeholder="请输入赛事题目/主题" />
				</view>
				<view class="match-creator input">
					<text class="label">主办方：</text> <input class="text_input disabled" type="text" disabled
						:value="userInfo.userName" />
				</view>
			</view>
			<ksp-cropper mode="fixed" :width="200" :height="150" :maxWidth="1024" :maxHeight="720" :url="url"
				@cancel="oncancel" @ok="onok"></ksp-cropper>
			<view class="right">
				<view class="uploadImg" @click="select">
					<view class="photo-icon" v-if="match.posterUrl==''">
						<van-icon size="8vw" color="#ddd" name="photo" />
					</view>
					<image class="poster" v-else :src="match.posterUrl" mode=""></image>
					<view class="tip">
						点击上传赛事海报
					</view>
				</view>
			</view>
		</view>
		<view class="match-description">
			<view class="label">评比说明：</view><textarea class="text-area" v-model="match.matchDescription"
				placeholder="输入比赛相关介绍以及评比说明" />
		</view>
		<view class="match-time">
			<text class="label">赛事时间：</text><button class="select-time"
				@click="selectorStartTime">{{timeFormat(match.startTime)||"选择开始时间"}}</button>-<button
				class="select-time" @click="selectorEndTime">{{timeFormat(match.endTime)||"选择结束时间"}}</button>
			<van-popup :show="timeSelectorShow" position="bottom" custom-style="height: 40%;" @close="onClose">
				<van-datetime-picker type="date" @cancel="timeSelectorShow=false" @confirm="getTime" :min-date="minDate"
					:value="selectTimeValue" :formatter="formatter" />
			</van-popup>

		</view>
		<view class="match-votableNumber">
			<text class="label">每人可投票数：</text>
			<van-stepper v-if="match.votableNumber" :value="match.votableNumber" @change="onChange" min="1" max="3"
				integer />

		</view>
		<view class="match-kind input">
			<text class="label">赛事种类：</text> <input class="text_input" type="text" v-model="match.matchKind"
				placeholder="请输入赛事种类" />
		</view>
		<view class="submit">
			<button class="submit-btn" @click="submit">{{isEdit?"修改":"发布"}}</button>
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
		ref,
		reactive,
		toRefs
	} from 'vue'
	import Notify from '/wxcomponents/dist/notify/notify';
	import {
		Toast
	} from '/wxcomponents/dist/toast/toast';
	export default {
		setup() {
			let userInfo = uni.getStorageSync('userInfo')
			// console.log(userInfo);
			let isEdit = ref(false);
			let match = ref({})

			onLoad(async (options) => {
				if (options.mid) {
					isEdit.value = true
					const {
						data: res
					} = await uni.$http.get(`/matchDetail?mid=${options.mid}`)
					if (res.code == 200) {
						let matchDetail = JSON.parse(JSON.stringify(res.data.match))
						delete matchDetail.isStar
						delete matchDetail.labelKind
						match.value = matchDetail
					} else {
						Toast({
							type: 'fail',
							message: res.message,
							duration: 1000,
						});
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					}

				} else {
					match.value = {
						title: "",
						posterUrl: "",
						startTime: 0,
						endTime: 0,
						matchDescription: "",
						matchKind: "",
						matchCreator: userInfo.userName,
						votableNumber: 1
					}
				}
			})

			let url = ref("")

			function select() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: (rst) => {
						// 设置url的值，显示控件
						url.value = rst.tempFilePaths[0];
					}
				});
			}
			async function onok(ev) {
				const {
					data: res
				} = await uni.$http.post('/uploadAvatar')
				// console.log(res)
				if (res.code == 200) {
					url.value = ""
					match.value.posterUrl = "../../static/logo.png"
				} else {
					url.value = ""
					Toast({
						type: 'fail',
						message: res.message,
						duration: 1000,
					});
				}
				// uni.uploadFile({
				// 	//请求的url接口地址
				// 	url: '/upload',
				// 	// formData: {
				// 	// 请求中接口额外的参数
				// 	// 	id: ''
				// 	// },
				// 	fileType: 'image', //图片类型
				// 	filePath: ev.path, //哪张图片
				// 	name: 'file', //对应接口的文件名称
				// 	header: { //请求头
				// 		"Content-Type": "multipart/form-data"
				// 	},
				// 	success: async ({
				// 		data: res
				// 	}) => {
				// 		//成功的回调
				// 		//一般用于重新获取数据渲染页面
				// 		console.log(res)
				// 		if (res.code == 200) {
				// 			match.value.posterUrl=res.data.imgUrl
				// 			url.value = "" // url设置为空，隐藏控件
				// 		} else {
				// 			url.value = ""
				// 			Toast({
				// 				type: 'fail',
				// 				message: res.message,
				// 				duration: 1000,
				// 			});
				// 		}
				// 	},
				// 	fail: (err) => {
				// 		console.log(err.errMsg);
				// 		url.value = ""
				// 		Notify({
				// 			message: err.errMsg,
				// 			background: '#f14b4b',
				// 			color: '#ffffff',
				// 			duration: 1500,
				// 		});
				// 	}
				// })
			}

			function oncancel() {
				// url设置为空，隐藏控件
				url.value = "";
			}

			let timeFlag = ref(null)

			let minDate = ref(new Date().getTime())
			let timeSelectorShow = ref(false)
			let selectTimeValue = ref(new Date().getTime())

			function onClose() {
				timeSelectorShow.value = false;
			}

			function selectorStartTime() {

				minDate.value = new Date().getTime()
				if (match.value.startTime>0&&match.value.startTime < minDate.value) {
					minDate.value = match.value.startTime
				}
				selectTimeValue.value = match.value.startTime
				timeSelectorShow.value = true
				timeFlag.value = 'startTime'
			}

			function selectorEndTime() {
				if (match.value.startTime > 0)
					minDate.value = match.value.startTime
				else
					minDate.value = new Date().getTime()
				selectTimeValue.value = match.value.endTime
				timeSelectorShow.value = true
				timeFlag.value = 'endTime'
			}

			function formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				}
				if (type === 'month') {
					return `${value}月`;
				}
				return value;
			}


			function getTime(event) {
				match.value[timeFlag.value] = event.detail
				timeSelectorShow.value = false
			}

			function timeFormat(time) {
				if (time && time > 0)
					return uni.$dayjs(time).format('YYYY-MM-DD')
				else return false
			}

			function onChange(event) {
				match.votableNumber = event.detail
			}

			async function submit() {
				// console.log(match);
				if (!isEdit.value) {
					const {
						data: res
					} = await uni.$http.post('/setMatch', {
						match: {
							...match.value
						}
					})
					if (res.code === 200) {
						Toast({
							type: 'success',
							message: res.message,
							duration: 1000,
						})

						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					}
				} else {
					const {
						data: res
					} = await uni.$http.post('/updateMatch', {
						match: {
							...match.value
						}
					})
					console.log(res);
					if (res.code === 200) {
						Toast({
							type: 'success',
							message: res.message,
							duration: 1000,
						})

						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					}
				}


			}


			return {
				userInfo,
				url,
				select,
				oncancel,
				onok,
				minDate,
				formatter,
				getTime,
				timeSelectorShow,
				onClose,
				selectorStartTime,
				selectorEndTime,
				timeFormat,
				onChange,
				match,
				submit,
				isEdit,
				selectTimeValue
			}
		}

	}
</script>

<style lang="scss">
	.addMatchPage {
		background-color: #fff;
		height: 100vh;
	}

	.panel {
		left: 0;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx;

		.left {
			width: 65%;
		}

		.right {
			width: 30%;
		}

		.uploadImg {
			position: relative;
			width: 100%;
			height: 140rpx;
			background-color: #2674df;
			border-radius: 15rpx;
			overflow: hidden;
			font-size: 26rpx;

			.photo-icon {
				position: absolute;
				top: 20%;
				left: 50%;
				transform: translateX(-50%);
			}

			.tip {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				color: #fff;
				background-color: #285aafc4;
				text-align: center;
				line-height: 1.5;
			}

			.poster {
				width: 100%;
				height: 100%;
			}
		}
	}

	.input {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx;
		height: 60rpx;

		.label {
			font-size: 30rpx;
			flex: 3;
			text-align: left;
		}

		.text_input {
			flex: 7;
			padding: 0 0 5rpx 5rpx;
			border-bottom: 2rpx solid #0056e0;
			font-size: 30rpx;
		}

		.disabled {
			color: #888;
		}
	}

	.match-description {
		padding: 10rpx 20rpx;
		font-size: 30rpx;

		.text-area {
			width: 100%;
			box-sizing: border-box;
			border-radius: 18rpx;
			padding: 15rpx;
			border: 1px solid #0056e0;
		}

		.label {
			padding: 5rpx;
			margin-bottom: 15rpx;
		}
	}

	.match-time {
		display: flex;
		align-items: center;
		padding: 20rpx;

		.label {
			font-size: 30rpx;
		}

		.select-time {
			display: inline-block;
			font-size: 28rpx;
			line-height: 2;
			border: 1rpx solid #0048cf;
			margin: 0 10rpx;
		}

		.timeSelector {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			transform: translateY(100%);
			animation: dowmToUp 0.3s forwards;
		}
	}

	.match-votableNumber {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		padding: 20rpx;

	}

	.match-kind {
		padding: 20rpx;
	}

	.submit-btn {
		margin: 40rpx auto;
		width: 80%;
		background-color: #236fff;
		color: #fff;
	}
</style>
