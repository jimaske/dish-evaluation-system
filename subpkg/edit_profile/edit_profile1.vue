<template>
	<view class="edit_profile">
		
		<van-toast id="van-toast" />
		<van-notify id="van-notify" />
		<van-overlay :show="show">
			<view class="wrapper">
				<view class="block">
					<view class="title">
						修改{{valueModule.title}}
					</view>
					<view class="edit">
						<input class="input" type="text" v-model="valueModule.value" :maxlength="valueModule.maxlength">
					</view>
					<div class="btns">
						<van-button style="flex:1;" icon="revoke"
							custom-style="width: 100%;border-radius: 0;border: 1px solid #eee; color:#8c4d00;font-size:34rpx;"
							plain @click="onClickHide"/>
						<van-button style="flex:1;" icon="success"
							custom-style="width: 100%;border-radius: 0;border: 1px solid #eee; color:#008000;font-size:34rpx;"
							plain @click="comfirm"/>
					</div>
				</view>
			</view>
		</van-overlay>
		<ksp-cropper mode="fixed" :width="200" :height="200" :maxWidth="1024" :maxHeight="1024" :url="url"
			@cancel="oncancel" @ok="onok"></ksp-cropper>
		<view hover-class="checkActive" class="row avatar" @click="select">
			<text class="left-content">头像</text>
			<view class="right-content">
				<van-image use-loading-slot width="50" height="50" :round="true" :src="userInfo.avatarUrl">
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>

				<van-icon name="edit" custom-style="margin-left:20rpx;color: #9a9a9a;" size="5vw" />
			</view>
		</view>
		<view class="row" hover-class="checkActive" data-name="userName" @click="onClickShow">
			<text class="left-content">昵称</text>
			<view class="right-content">
				<text>{{userInfo.userName}}</text>
				<van-icon name="edit" custom-style="margin-left:20rpx;color: #9a9a9a;" size="5vw" />
			</view>
		</view>
		<view class="row" data-name="signature" @click="onClickShow">
			<text class="left-content">个性签名</text>
			<view class="right-content">
				<text>{{userInfo.signature}}</text>
				<van-icon name="edit" custom-style="margin-left:20rpx;color: #9a9a9a;" size="5vw" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		computed,
		reactive,
		ref,
		watch
	} from 'vue'
	import {
		useStore
	} from 'vuex'
	import {
		Toast
	} from '/wxcomponents/vant/toast/toast';
	import Notify from '/wxcomponents/vant/notify/notify';
	export default {

		setup() {
			const store = useStore()
			let userInfo = computed(() => store.state.user.userInfo)

			let url = ref("")
			let path = ref("")

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
				
				uni.uploadFile({
					//请求的url接口地址
					url: 'http://127.0.0.1:8080/uploadAvatar',
					// formData: {
					// 请求中接口额外的参数
					// 	id: ''
					// },
					fileType: 'image', //图片类型
					filePath: ev.path, //哪张图片
					name: 'file', //对应接口的文件名称
					header: { //请求头
						"Content-Type": "multipart/form-data"
					},
					success: (res) => {
						//成功的回调
						//一般用于重新获取数据渲染页面
						let result=JSON.parse(res.data)
						if (result.code == 200) {
							store.commit('user/setAvatar', result.data.avatarUrl)
							url.value = "" // url设置为空，隐藏控件
						} else {
							url.value = ""
							Toast({
								type: 'fail',
								message: res.message,
								duration: 1000,
							});
						}
					},
					fail: (err) => {
						error=JSON.parse(err.data)
						console.log(err.errMsg);
						url.value = ""
						Notify({
							message: err.errMsg,
							background: '#f14b4b',
							color: '#ffffff',
							duration: 1500,
						});
					}
				})
			}

			function oncancel() {
				// url设置为空，隐藏控件
				url.value = "";
			}

			let nameEdit = ref(false)
			let show = ref(false)

			let valueName=ref("")
			let valueModule =reactive({
				title:"",
				value:"",
				name:"",
				maxlength:25
			}) 
			function onClickShow(e) {
				if(e.currentTarget.dataset.name){
					show.value = true
					let name=e.currentTarget.dataset.name
					if(name==="userName"){
						valueModule.title="昵称"
						valueModule.maxlength=7
					}
					else if(name==="signature"){
						valueModule.title="个性签名"
						valueModule.maxlength=25
					}
					valueModule.name=name
					valueModule.value=userInfo.value[valueModule.name]
				}
			}

			function onClickHide() {
				show.value = false
			}
			
			async function getUserInfo() {
				const {
					data: res
				} = await uni.$http.get("/getUserInfo")
				if (res.code === 200) {
					store.commit('user/setUserInfo', res.data.user)
				}
			}
			
			async function comfirm(){
				let value={}
				value[valueModule.name]=valueModule.value
				const {
					data: res
				} = await uni.$http.post('/edit',value)
				if(res.code===200){
					getUserInfo()
					show.value = false
				}
				
				
			}
			function noop() {
				console.log(1);
			}
			return {
				userInfo,
				select,
				onok,
				oncancel,
				url,
				path,
				nameEdit,
				show,
				onClickHide,
				onClickShow,
				valueModule,
				comfirm
			}
			// getUserInfo()
		}

	}
</script>

<style lang="scss" scoped>
	.checkActive {
		opacity: 0.8;
		transition: 0.2s;
		background-color: #ddd !important;
	}

	.wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.block {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 80vw;
		height: 50vw;
		background-color: #fff;
		border-radius: 15rpx;
		overflow: hidden;

		.edit {
			padding: 0 20rpx;

			.input {
				padding-left: 15rpx;
				border-bottom: 1px solid #999;
				font-size: 34rpx;
			}
		}

		.title {
			padding: 15rpx;
			font-size: 38rpx;
			text-align: center;
		}

		.btns {
			display: flex;
		}
	}

	.test-image {
		width: 500rpx;
		height: 500rpx;
	}

	.edit_profile {
		padding: 20rpx 0;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		background-color: #fff;
		padding: 15rpx;
		border-bottom: 1px solid #ececec;



	}

	.left-content {
		font-size: 30rpx;
		color: #222;
	}

	.right-content {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #888;
	}

	.avatar {
		height: 100rpx;
	}
</style>
