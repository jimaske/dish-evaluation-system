import httpRequests from './request.js'

//获取首页信息
export const reqGetHome = (params) => httpRequests.get('/home');

//获取比赛列表
export const reqGetMatch = (params) => httpRequests.get('/matches',{params});
//获取比赛详细信息
export const reqGetMatchDetail = (params) => httpRequests.get('/matchDetail',{params});
//获取比赛参赛食品
export const reqGetMatchDishes = (params) => httpRequests.get('/matchDishes',{params});
//获取比赛可投票数
export const reqGetVotableNumber = (params) => httpRequests.get('/votableNumber',{params});

//用户相关请求
//获取用户登录状态
export const reqGetLoginStatus = (params) => httpRequests.get('/loginStatus',{params});
//退出登录
export const reqLogout = () => httpRequests.get('/logout');