import store from "../store/index.js";

//导入网络请求的包
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
// 配置请求根路径
$http.baseUrl = '/mock'
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...'
	})
	let token = store.state.user.token
	let params=options.data.params
	if(options.method=="GET"&&params&&params!={}){
		let url=options.url+'?'
		for(let key in params){
			url+=key+'='+params[key]+'&'
		}
		options.url=url.slice(0,url.length-1)
		delete options.data.params
	}
	if (token) {
		// 为请求头添加身份认证字段
		options.header = {
			// 字段的值可以直接从 vuex 中进行获取
			Authorization: token
		}
		
	}
}
$http.afterRequest = function(options) {
	uni.hideLoading()
	if (options.statusCode != 200) {
		uni.$showMsg()
	} else if (options.statusCode === 200 && options.data.code === 501) {
		let pageRoute= getCurrentPages()
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
export default $http