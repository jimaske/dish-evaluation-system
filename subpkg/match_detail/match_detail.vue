<template>
	<page-meta :page-style="show ? 'overflow: hidden;' : '' " />
	<ksp-cropper mode="fixed" :width="200" :height="200" :maxWidth="1024" :maxHeight="1024" :url="url"
		@cancel="oncancel" @ok="onok"></ksp-cropper>
	<view class="match_detail">
		<van-dialog id="van-dialog" />
		<van-toast id="van-toast" />
		<!-- 编辑比赛作品 -->
		<van-popup :show="show" @close="onClose" round :close-on-click-overlay="false">
			<view class="editDish">
				<view class="first-row">
					<view class="title">
						{{isEdit?"作品编辑":"新增作品"}}
					</view>
					<view class="close" @click="show=false">
						<van-icon size="4vw" color="#333" name="cross" />
					</view>
				</view>

				<view class="second-row">

					<view class="uploadImg" @click="select">

						<view class="photo-icon" v-if="dish.imgUrl==''">
							<van-icon size="10vw" color="#ddd" name="photo" />
						</view>
						<image class="poster" v-else :src="dish.imgUrl" mode=""></image>
						<view class="tip">
							上传作品海报
						</view>
					</view>
					<view class="right-content">
						<view class="name">
							<view class="label">
								<text class="label-text">作品名称</text>：
							</view>
							<view class="dishName ">
								<input class="text-input" type="text" v-model="dish.dishName" placeholder="请输入作品名称">
							</view>
						</view>
						<view class="address">
							<view class="label">
								<text class="label-text">地址</text>：
							</view>
							<view class="dishAddress">

								<input class="text-input" type="text" v-model="dish.address" placeholder="请输入餐厅地址">
							</view>
						</view>
					</view>
				</view>
				<view class="row description">
					<view class="label">
						<text class="label-text">作品描述</text>：
					</view>
					<textarea :fixed="true" :cursor-spacing="20" v-model="dish.dishDescription" placeholder="请输入作品描述" />
				</view>
				<view class="submit" @click="submit">
					<button class="submit-btn">提交</button>
				</view>

			</view>

		</van-popup>
		<match-info></match-info>
		<van-sticky>
			<view class="navlist">
				<view class="nav-vote" :class="{active:currentTab===0}" @click="currentTab=0"><text class="big">投票<text
							style="font-size: 26rpx;">({{matchInfo.votableNumber}})</text></text><text
						class="small">{{matchInfo.totalVotes}}人投</text>
				</view>
				<view class="nav-comment" :class="{active:currentTab===1}" @click="currentTab=1"><text
						class="big">评论</text><text class="small">{{matchInfo.totalComments}}人评</text>
				</view>
			</view>
		</van-sticky>
		<swiper class="swiper-box-list" duration="300" :style="{height: swiperHeight+'px'}" :current="currentTab"
			@change="swiperChange">
			<swiper-item class="swiper-topic-list">
				<vote-dish id="content-wrap0" @setSwiperHeight="setSwiperHeight"
					:votableNumber="matchInfo.votableNumber" @toComment="toComment" @editDish="editDish"></vote-dish>
			</swiper-item>
			<swiper-item class="swiper-topic-list">
				<match-comment @setSwiperHeight="setSwiperHeight" :noCommentFirstShow="noCommentFirstShow"
					id="content-wrap1" ref="matchComment" @getCommentTop="getCommentTop" :commentTop="commentTop">
				</match-comment>
			</swiper-item>
		</swiper>
		<view class="comment" v-show="currentTab===1">
			<van-field label="" :value="data.textContent" type="textarea" :placeholder="`在这里留下你的妙评呗~`" autosize
				border="{{ false }}" maxlength=170 show-word-limit :show-confirm-bar="false" @input="checkContent"
				use-button-slot>
				<van-button slot="button" size="small"
					custom-style="background-color: #1175ff;color: #fff;font-size: 26rpx;border-radius: 10rpx;"
					@tap="release" :disabled="isContentNull">
					发布
				</van-button>
			</van-field>
		</view>
	</view>
</template>

<script>
	import {
		onLoad
	} from '@dcloudio/uni-app'

	import {
		computed,
		ref,
		watch,
		nextTick,
		getCurrentInstance,
		reactive
	} from "vue";
	import {
		useStore
	} from 'vuex'
	import {
		Toast
	} from '/wxcomponents/dist/toast/toast';
	import {
		Dialog
	} from '/wxcomponents/dist/dialog/dialog';
	export default {

		setup() {
			let _this = getCurrentInstance();

			const store = useStore()
			let matchInfo = computed(() => {
				return store.state.match.matchInfo
			});

			let mid = computed(() => store.state.match.mid)
			let commentList = ref([])

			onLoad((options) => {
				store.commit('match/setMid', options.mid)
				store.dispatch('match/getMatchDetail')
				store.dispatch('match/getMatchDishes')

			})
			let noCommentFirstShow = ref(false)
			let screenWidth = ref(uni.getWindowInfo().windowWidth)
			let isDish = ref(true)
			let currentTab = ref(0)
			//滑块的高度(单位px)
			let swiperHeight = ref(0)

			function toComment() {
				currentTab.value = 1
			}

			function swiperChange(e) {
				currentTab.value = e.detail.current
				if (e.detail.current = 1 && !noCommentFirstShow.value)
					noCommentFirstShow.value = true
				else {
					let element = "#content-wrap" + currentTab.value;
					let query = uni.createSelectorQuery().in(_this);
					query.select(element).boundingClientRect(res => {
						if (res && res.height != 0) {
							// 	swiperHeight.value = res.height;
							setSwiperHeight(res.height)
						}
					}).exec();
				}
				nextTick(() => {
					getCommentTop()
				})
			}
			//动态设置swiper的高度
			function setSwiperHeight(height) {
				swiperHeight.value = height;
			}

			let data = reactive({
				textContent: ''
			})
			let isContentNull = ref(true) //判断输入框里面的内容是否为空
			let commentDishId = computed(() => {
				return store.state.match.commentDishId
			})

			function checkContent(event) {
				if (event.detail.trim() === '') {
					isContentNull.value = true
				} else {
					isContentNull.value = false
				}
				data.textContent = event.detail
			}
			const matchComment = ref(null)

			async function release() {
				let getMatchComments = matchComment.value.getMatchComments
				if (isContentNull.value) {
					Toast({
						type: 'fail',
						message: '内容为空',
						duration: 1000,
					});
				} else {
					let did = 0
					if (commentDishId.value != '') {
						did = commentDishId.value * 1
					}

					const {
						data: res
					} = await uni.$http.post('/commentDish', {
						did,
						mid: mid.value * 1,
						commentContent: data.textContent
					})
					if (res.code === 200) {
						Toast({
							type: 'success',
							message: '发布成功',
							duration: 1000,
						});
						getMatchComments(commentDishId.value)
						data.textContent = ''
						isContentNull.value = true
					}
				}

			}
			let commentTop = ref(0)

			function getCommentTop() {
				const query = uni.createSelectorQuery().in(_this);
				query.select('.comment').boundingClientRect(res => {
					commentTop.value = res.top
				}).exec();
			}

			//显示菜品编辑框
			let isEdit = ref(true)
			let dishList = computed(() => store.state.match.dishList);
			let dish = ref({})

			function editDish(did) {
				show.value = true
				if (did) { //编辑参赛作品
					isEdit.value = true;
					let index = dishList.value.findIndex(item => did === item.did)
					let temDish = JSON.parse(JSON.stringify(dishList.value[index]))
					delete temDish.isVote
					dish.value = temDish
				} else { //新增参赛作品
					isEdit.value = false
					dish.value = {
						midLink: mid.value,
						imgUrl: "",
						dishName: "",
						address: "",
						dishDescription: ""
					}
				}

			}


			let show = ref(false)

			function onClose() {
				show.value = false;

			}

			let url = ref("")

			function select() { //选择参赛作品图片
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
					dish.value.imgUrl = "../../static/logo.png"
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
				// 			match.value.imgUrl=res.data.imgUrl
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

			
			async function submit() {
				if (isEdit.value) {
					const {
						data: res
					} = await uni.$http.post('/updateDish', {
						dish: {
							...dish.value
						}
					})
					console.log(res);
					if (res.code === 200) {
						Toast({
							type: 'success',
							message: res.message,
							duration: 1000,
						})
					} else {
						Toast({
							type: 'fail',
							message: res.message,
							duration: 1000,
						})
					}
					store.dispatch('match/getMatchDishes')
					onClose()
				} else {
					const {
						data: res
					} = await uni.$http.post('/setDish', {
						dish: {
							...dish.value
						}
					})
					if (res.code === 200) {
						Toast({
							type: 'success',
							message: res.message,
							duration: 1000,
						})
						store.dispatch('match/getMatchDishes')
						onClose()
					}
				}

			}

			function oncancel() {
				// url设置为空，隐藏控件
				url.value = "";
			}

			return {
				matchInfo,
				commentList,
				isDish,
				screenWidth,
				currentTab,
				swiperChange,
				swiperHeight,
				setSwiperHeight,
				noCommentFirstShow,
				data,
				checkContent,
				isContentNull,
				release,
				matchComment,
				toComment,
				getCommentTop,
				commentTop,
				editDish,
				show,
				onClose,
				isEdit,
				dish,
				onok,
				select,
				url,
				oncancel,
				submit,
			}
		}


	}
</script>

<style lang="scss" scoped>
	.match_detail {
		min-height: 100vh;
		padding: 0 0 60rpx;
		box-sizing: border-box;
		background-color: #efefef;


		.navlist {
			display: flex;
			padding: 10rpx 30rpx;
			background-color: #efefef;

			.nav-vote,
			.nav-comment {
				font-size: 30rpx;
				margin-right: 35rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.big {
					letter-spacing: 5rpx;
				}

				.small {
					font-size: 20rpx;
					color: #999;
				}

				&.active {
					position: relative;
					color: #e28800;

					.small {
						color: #e28800;
					}

					&::before {
						position: absolute;
						content: '';
						width: 50rpx;
						height: 6rpx;
						left: 50%;
						transform: translateX(-50%);
						bottom: -10rpx;
						border-radius: 2rpx;
						background-color: #e28800;
					}
				}
			}
		}

		.swiper-box-list {
			// height: auto;
		}

		.comment {
			// display: flex;
			position: fixed;
			left: 0rpx;
			right: 0rpx;
			bottom: 0rpx;
			border-top: 1px solid #dadada;
			background-color: #fff;
			overflow: hidden;
		}

		.editDish {
			width: 80vw;
			height: 60vh;
			padding: 25rpx;

			.first-row,
			.second-row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;
			}

			.second-row {
				height: 300rpx;

				.right-content {
					height: 100%;
					padding: 0 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
				}
			}

			.title {
				font-size: 34rpx;
			}

			.close {
				width: 40rpx;
				height: 40rpx;
				background-color: transparent;
				line-height: 40rpx;
				text-align: center;
			}

			.uploadImg {
				position: relative;
				width: 280rpx;
				height: 280rpx;
				flex-shrink: 0;
				background-color: #2674df;
				border-radius: 15rpx;
				overflow: hidden;
				font-size: 26rpx;

				.photo-icon {
					position: absolute;
					top: 30%;
					left: 50%;
					transform: translateX(-50%);
				}

				.tip {
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					color: #fff;
					background-color: #1750b1c4;
					text-align: center;
					line-height: 2;
				}

				.poster {
					width: 100%;
					height: 100%;
				}
			}

			.text-input {
				border-bottom: 1px solid #888;
				font-size: 32rpx;
			}

			.label {
				font-size: 30rpx;
				margin-bottom: 15rpx;

				.label-text {
					position: relative;
				}

				.label-text::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					height: 10rpx;
					background-color: #ffab0094;
					border-radius: 5rpx;
				}
			}

			.name {
				display: flex;
				flex-direction: column;
				justify-content: space-around;

			}

			.submit-btn {
				width: 500rpx;
				background-color: #2674df;
				color: #fff;
			}
		}

	}
</style>
