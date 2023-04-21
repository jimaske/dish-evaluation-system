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
//导入网络请求的包
import {
	$http
} from '@escook/request-miniprogram'
uni.$http = $http
$http.baseUrl = '/mock'
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...'
	})
	let token = store.state.user.token
	if (token) {
		// 为请求头添加身份认证字段
		options.header = {
			// 字段的值可以直接从 vuex 中进行获取
			Authorization: token
		}
	}
}
uni.$countDown=""
$http.afterRequest = function(options) {
	uni.hideLoading()
	if (options.statusCode != 200) {
		uni.$showMsg()
	} else if (options.statusCode === 200 && options.data.code === 501) {
		console.log(options);
		let pageRoute= getCurrentPages()
		console.log(pageRoute[pageRoute.length-1].$page.fullPath);
		uni.$showMsg("您还没有登录！")
		uni.redirectTo({
			url: '/subpkg/login/login',
			success: function() {
				store.commit('user/setRedirectInfo', {
					from:pageRoute[pageRoute.length-1].$page.fullPath
				})
			}
		});
		
		
	}
}


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
