// #ifndef VUE3
import Vue from 'vue'

import Mock from './mock'

import store from "./store";

uni.$showMsg = function(title = "数据请求失败!", duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

uni.$countDown=""

import dayjs from 'dayjs'
uni.$dayjs = dayjs

import App from './App'



import {
	createSSRApp
} from 'vue'
// 不能修改导出的 createApp 方法名，不能修改从 Vue 中导入的 createSSRApp。
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	return {
		app
	}
}
