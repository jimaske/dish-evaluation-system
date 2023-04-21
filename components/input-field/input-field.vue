<template>
	<!-- 登录注册表单组件 -->
	<view v-for="item in temFormLabel" :key="item.name">
		<view class="row" v-if="item.type === 'password'">
			<input class="password_input" @blur="blurCheckForm" :data-name="item.name"
				:type="item.passwordType?'password':'text'" v-model="formValue[item.name]"
				:placeholder="item.placeholder" 
				placeholder-style="font-size:26rpx;" 
			/>
			<view class="eyes-icon" @click="item.passwordType=!item.passwordType">
				<van-icon v-show="item.passwordType" name="closed-eye" size="4.5vw" />
				<van-icon v-show="!item.passwordType" name="eye-o" size="4.5vw" />
			</view>
			<view class="waring" v-show="item.wrongText!=''&&!item.isRight">
				{{item.wrongText}}
			</view>
			<view class="passed-icon" v-show="item.isRight&&item.passFlag">
				<van-icon size="5vw" color="#38a500" name="passed" />
			</view>
		</view>
		<view class="row" v-if="item.type === 'text'">
			<input 
				class="text_input"
				@blur="blurCheckForm"
				:data-name="item.name"
				type="text" 
				v-model="formValue[item.name]" 
				:placeholder="item.placeholder" 
				placeholder-style="font-size:26rpx;" 
			/>
			<view class="waring" v-show="item.wrongText!=''&&!item.isRight">
				{{item.wrongText}}
			</view>
			<view class="passed-icon" v-show="item.isRight&&item.passFlag">
				<van-icon size="5vw" color="#38a500" name="passed" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ref,
		computed,
		reactive,
		watch
	} from 'vue'
	export default {
		name: "inputField",
		props: ["formLabel", "formValue"],
		setup(props) {
			let temFormLabel = ref([])
			let temFormValue = ref({})
			watch(()=>props.formLabel, (newValue) => {
				temFormLabel.value = [...newValue]
				temFormLabel.value.forEach(item => {
					if (item.type === 'password') {
						item.passwordType = true //tru表示是输入框类型是密码
					}
					item.wrongText = ''
					item.isRight = false
				})
			},{immediate:true})
			
			function checkFormItem(item){
				if(item.required){
					if(props.formValue[item.name]!=''){
						item.wrongText=''
						item.isRight=true
					}else{
						item.wrongText=item.wrongMessage
						item.isRight=false
						return false
					}
				}
				if (item.checkFunction) {
					let res=item.checkFunction(props.formValue[item.name], props.formValue)
					if(res){
						item.wrongText=''
						item.isRight=true
						return true
					}else{
						item.wrongText=item.wrongMessage
						item.isRight=false
						return false
					}
				} 
				if(item.Reg){
					let itemReg = new RegExp(item.Reg)
					if (itemReg.test(props.formValue[item.name])) {
						item.wrongText=''
						item.isRight=true
						return true
					}else{
						item.wrongText=item.wrongMessage
						item.isRight=false
						return false
					}
				}
				return true
			}
			function blurCheckForm(e) {
				let itemIndex = temFormLabel.value.findIndex((item) => {
					return e.target.dataset.name === item.name && (item.required||item.Reg || item.checkFunction)
				})
				if (itemIndex != -1) {
					let item = temFormLabel.value[itemIndex]
					checkFormItem(item)
				}
			}
			function validate(callback) {
				let wrongIndex=temFormLabel.value.findIndex((item) => {
					return !checkFormItem(item)
				})
				wrongIndex===-1?callback(true):callback(false)
			}
			return {
				temFormLabel,
				blurCheckForm,
				temFormValue,
				validate
			}
		}
	}
</script>

<style lang="scss" scoped>
	.password_input,
	.text_input {
		border-bottom: 1px solid #ccc;
		padding: 15rpx 5rpx;
		font-size: 30rpx;
	}

	.row {
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
</style>
