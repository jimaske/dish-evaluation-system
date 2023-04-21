import Mock from 'better-mock/dist/mock.mp.js'
import getHomeData from './getHomeData'
import getMatchesData from './getMatchesData'
import getMatchDetail from  './getMatchDetail'
import getMatchDishes from  './getMatchDishes'
import getMatchComments from  './getMatchComments'
import getUser from  './getUser'
import getMatch from  './getMatch'

Mock.mock('/mock/home','get',getHomeData )
Mock.mock('/mock/matches','get',getMatch )
Mock.mock('/mock/matchDetail','get',getMatch )
Mock.mock('/mock/matchDishes','get',getMatchDishes )
Mock.mock('/mock/matchComments','get',getMatchComments )
Mock.mock('/mock/commentLike','post',(option)=>{
	getUser(option)
	return getMatchComments(option)
} )
Mock.mock('/mock/cancelCommentLike','post',(option)=>{
	getUser(option)
	return getMatchComments(option)
} )
Mock.mock('/mock/starMatch','post',getMatch )
Mock.mock('/mock/cancelStarMatch','post',(option)=>{
	getMatch(option);
	return getUser(option)
} )
Mock.mock('/mock/voteDish','post',getMatchDishes)
Mock.mock('/mock/votableNumber','get',getMatch )
Mock.mock('/mock/commentDish','post',(option)=>{
	getUser(option)
	return getMatchComments(option)
})
Mock.mock('/mock/deleteComment','post',(option)=>{
	getMatchComments(option)
	return getUser(option)
})

Mock.mock('/mock/login','post',getUser)
Mock.mock('/mock/loginStatus','get',getUser)
Mock.mock('/mock/starList','get',getUser)
Mock.mock('/mock/voteHistoryList','get',getUser)
Mock.mock('/mock/myCommentList','get',getUser)
Mock.mock('/mock/getUserInfo','get',getUser)
Mock.mock('/mock/uploadAvatar','post',getUser)
Mock.mock('/mock/edit','post',getUser)
Mock.mock('/mock/logout','get',getUser)
Mock.mock('/mock/register','post',getUser)
Mock.mock('/mock/setMatch','post',getMatch)
Mock.mock('/mock/updateMatch','post',getMatch)
Mock.mock('/mock/deleteMatch','post',getMatch)
Mock.mock('/mock/updateDish','post',getMatchDishes)
Mock.mock('/mock/deleteDish','post',getMatchDishes)
Mock.mock('/mock/setDish','post',getMatchDishes)



