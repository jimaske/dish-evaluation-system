<template>
	<van-notify id="van-notify" />
	<view class="login-page">
		<view class="login-top">
			<image class="login-bg" src="../../static/login-bg.jpg" mode=""></image>
			<text class="logo-name">菜优投</text>
			<view class="btn">
				<text class="btn-text login-btn" :class="{active:isLogin}" @click="isLogin=true">登录</text>
				<text class="btn-text register-btn" :class="{active:!isLogin}" @click="isLogin=false">注册</text>
			</view>
		</view>
		<view class="main-content">
			<view class="login-content" v-show="isLogin">
				<input-field ref="loginFormRef" :formLabel="loginFormLabel" :formValue="loginFormValue"></input-field>
			</view>
			<view class="register-content" v-show="!isLogin">
				<input-field ref="registerFormRef" :formLabel="registerFormLabel" :formValue="registerFormValue">
				</input-field>
			</view>
			<button type="primary" class="login-btn" @tap="submitForm">{{isLogin?'登录':'注册'}}</button>
			<view class="forget-password" v-show="isLogin">忘记密码</view>
		</view>
	</view>
</template>

<script>
	import hex_md5 from '../../utils/md5.js';
	import {
		ref,
		computed,
		reactive,
		toRefs,
		watch
	} from 'vue'
	import {
		useStore
	} from 'vuex'
	import Notify from '/wxcomponents/dist/notify/notify';
	export default {
		setup() {
			const store = useStore()

			const registerFormRef = ref(null)
			const loginFormRef = ref(null)
			let loginFormLabel = ref([{
				name: "account",
				type: "text",
				placeholder: "请输入账号",
				required: true,
				wrongMessage: "请输入账号",
				passFlag: false

			}, {
				name: "password",
				type: "password",
				placeholder: "请输入密码",
				required: true,
				wrongMessage: "请输入密码",
				passFlag: false
			}])
			let loginFormValue = ref({
				account: '',
				password: ''
			})

			async function submitForm() {
				if (isLogin.value) {
					loginFormRef.value.validate(async (valid) => {
						if (valid) {
							const {
								data: res
							} = await uni.$http.post("/login", {
								account: loginFormValue.value.account,
								password: hex_md5(loginFormValue.value.password)
							})
							if (res.code === 200) {
								uni.setStorageSync('token', res.data.token)
								store.commit('user/setToken', res.data.token)
								store.commit('user/setUserStatus', res.data.status)
								navigateBack()
							} else {
								console.log("账号或密码错误");
								Notify({
									message: '账号或密码错误',
									background: '#f14b4b',
									color: '#ffffff',
									duration: 1500,
								});

							}
						}
					})
				} else {
					registerFormRef.value.validate(async (valid) => {
						if (valid) {
							const {
								data: res
							} = await uni.$http.post("/register", {
								account: registerFormValue.value.account,
								password: hex_md5(registerFormValue.value
									.password),
								status: 0
							})
							if (res.code === 200) {
								Notify({
									message: '注册成功',
									background: '#31ba1b',
									color: '#ffffff',
									duration: 1500,
								});
								registerFormValue.value = {
									account: '',
									password: '',
									passwordTest: ''
								}
								registerFormLabel.value = [{
									name: "account",
									type: "text",
									placeholder: "请输入邮箱地址",
									Reg: "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$",
									wrongMessage: "请输入格式为邮箱地址的账号",
									required: true,
									passFlag: true
								}, {
									name: "password",
									type: "password",
									placeholder: "请输入6-20位只含数字和字母的密码",
									Reg: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,20}$",
									wrongMessage: "请输入6-20位只含有数字和字母的密码",
									required: true,
									passFlag: true
								}, {
									name: "passwordTest",
									type: "password",
									placeholder: "请重复输入一次密码",
									Reg: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,20}$",
									wrongMessage: "两次密码不一样",
									checkFunction: (value, formValiue) => {
										if (value === formValiue.password)
											return true
										else
											return false
									},
									required: true,
									passFlag: true
								}]
								isLogin.value = true
							} else {
								Notify({
									message: '账号或密码错误',
									background: '#f14b4b',
									color: '#ffffff',
									duration: 1500,
								});

							}
							console.log("校验成功");
							console.log(registerFormValue.value);
						} else {
							console.log("校验失败");
						}

					});

				}

			}

			let redirectInfo = computed(() => store.state.user.redirectInfo)

			function navigateBack() {
				if (redirectInfo.value) {
					if (redirectInfo.value.openType === 'switchTab') {
						uni.switchTab({
							url: redirectInfo.value.from,
							complete: () => {
								store.commit('user/setRedirectInfo', null)
							}
						})
					} else {
						uni.redirectTo({
							url: redirectInfo.value.from,
							complete: () => {
								store.commit('user/setRedirectInfo', null)
							}
						})
					}
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}

			}

			let registerFormLabel = ref([{
				name: "account",
				type: "text",
				placeholder: "请输入邮箱地址",
				Reg: "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$",
				wrongMessage: "请输入格式为邮箱地址的账号",
				required: true,
				passFlag: true
			}, {
				name: "password",
				type: "password",
				placeholder: "请输入6-20位只含数字和字母的密码",
				Reg: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,20}$",
				wrongMessage: "请输入6-20位只含有数字和字母的密码",
				required: true,
				passFlag: true
			}, {
				name: "passwordTest",
				type: "password",
				placeholder: "请重复输入一次密码",
				Reg: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,20}$",
				wrongMessage: "两次密码不一样",
				checkFunction: (value, formValiue) => {
					if (value === formValiue.password)
						return true
					else
						return false
				},
				required: true,
				passFlag: true
			}])

			let isTypePassword = ref(true)

			let isLogin = ref(true)
			let registerFormValue = ref({
				account: '',
				password: '',
				passwordTest: ''
			})
			let checkFormFormat = reactive({
				isAccountRight: false,
				isPasswordRight: false,
				isSamePassword: false
			})


			return {
				submitForm,
				isTypePassword,
				isLogin,
				...toRefs(checkFormFormat),
				registerFormLabel,
				registerFormValue,
				loginFormLabel,
				loginFormValue,
				registerFormRef,
				loginFormRef
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* CDN 服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
	@font-face {
		font-family: "阿里妈妈数黑体 Bold";
		font-weight: 700;
		src: url("//at.alicdn.com/wf/webfont/sCTsfCuA7SLp/ObOdUnY8_GZlJ9QzGv1oX.woff2") format("woff2"),
			url("//at.alicdn.com/wf/webfont/sCTsfCuA7SLp/U651jpx2ej-1uoPjzxfq6.woff") format("woff");
		font-display: swap;
	}

	.login-top {
		position: relative;
		height: 350rpx;

		.login-bg {
			width: 100%;
			height: 350rpx;
		}

		.logo-name {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-family: "阿里妈妈数黑体 Bold";
			font-size: 72rpx;
			color: #fff;
		}

		.btn {
			position: absolute;
			left: 50%;
			bottom: -40rpx;
			transform: translate(-50%);
			background-color: #fff;
			border-radius: 40rpx;
			width: 430rpx;
			height: 80rpx;
			box-shadow: 0px 2px 4px -1px #1ecbff;

			.btn-text {
				position: absolute;
				display: inline-block;
				width: 250rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 40rpx;
				letter-spacing: 5rpx;
				background-color: #fff;
				color: #000;
			}

			.btn-text.active {
				color: #fff;
				background-color: #02a7ff;
				z-index: 1;
			}

			.login-btn {
				top: 0;
				left: 0;
				z-index: 1;
			}

			.register-btn {
				top: 0;
				left: 180rpx;
				// margin-left: -80rpx;
				// z-index: 1;
			}

		}
	}

	.main-content {
		margin-top: 80rpx;

		.input {
			border-bottom: 1px solid #ccc;
			padding: 15rpx 5rpx;
			font-size: 30rpx;
		}

		.account,
		.password {
			position: relative;
			width: 60vw;
			height: 6.5vh;
			margin: 40rpx auto;

			.waring {
				// background-color: red;
				color: #e82828;
			}
		}

		.passed-icon {
			position: absolute;
			left: 100%;
			top: 20%;
			z-index: 2;
		}

		.eyes-icon {
			position: absolute;
			right: 5rpx;
			top: 20%;
			z-index: 2;
		}

		.login-btn {
			margin-top: 80rpx;
			width: 350rpx;
			font-size: 30rpx;
			border-radius: 50rpx;
			line-height: 2.5;
			background-color: #0092f1;
			letter-spacing: 5rpx;
		}

		.forget-password {
			width: 140rpx;
			margin: 20rpx auto;
			font-size: 24rpx;
			color: #999;
			text-align: center;
		}
	}
</style>
