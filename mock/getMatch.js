function param2Obj(url) {
	const search = url.split('?')[1]
	if (!search) {
		return {}
	}
	return JSON.parse(
		'{"' +
		search
		.replace(/"/g, '\\"')
		.replace(/&/g, '","')
		.replace(/=/g, '":"') +
		'"}'
	)
}
let List = [{
	mid: 1000010,
	title: "南邮“面王”评比大赛",
	startTime: 1651715800000,
	endTime: 1671715800000,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYKbT.png",
	matchDescription: "红香细剥莺哥嘴，嫩白鲜羹玉面条。对于学校各种各样的面条，你最喜欢吃哪一种，为你喜欢的面条投上宝贵的一票吧！",
	totalDishes: 30,
	totalVotes: 352,
	totalComments: 98,
	matchCreator: "南京邮电大学",
	isStar: true,
	labelKind: 0,
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南三新开的羊杂面真的巨好吃”",
	matchKind: "面食评比赛",
	isOwn:true
}, {
	mid: 1000001,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCf51t.jpg",
	title: "甜到我心里",
	startTime: 1651715800000,
	endTime: 1670256000000,
	totalDishes: 30,
	totalVotes: 338,
	totalComments: 111,
	labelKind: 0, //0无，1投票，2评论，3收藏
	votableNumber: 1, //代表用户可投票数,
	hotCommond: "“聚甜斋蛋糕永远的神，特别是新出的抹茶甜甜蛋糕”",
	matchDescription: "幸福就是甜品的味道;每一道甜品都有一个故事,对于学校各式各样的甜品，你最喜欢品尝哪一种，为它投上宝贵的一票吧！",
	matchKind: "甜品评比赛"
}, {
	mid: 1000002,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYjOC.png",
	title: "面条嗦起来",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 329,
	totalComments: 101,
	labelKind: 1, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“新开的羊杂面真的巨好吃！”",
	matchKind: "面食评比赛"
}, {
	mid: 1000003,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYkGK.png",
	title: "地方菜我最知道",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 329,
	totalComments: 101,
	labelKind: 2, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南二2楼的川菜鱼香肉丝必须有排面！”",
	matchKind: "特色菜评比赛"
}, {
	mid: 1000004,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYVNo.png",
	title: "早餐吃好又吃饱",
	startTime: 1651715800000,
	endTime: 1673083200000,
	totalDishes: 30,
	totalVotes: 248,
	totalComments: 101,
	labelKind: 0, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南二1楼的夫子面每天早上人巨多。”",
	matchKind: "早餐评比赛"
}, {
	mid: 1000005,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYhES.png",
	title: "谁是南邮汉堡王",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 248,
	totalComments: 101,
	labelKind: 3, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“堡马先生也还行。”",
	matchKind: "汉堡评比赛",
	isOwn:true
},{
	mid: 1000020,
	title: "南邮“面王”评比大赛",
	startTime: 1651715800000,
	endTime: 1671715800000,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYKbT.png",
	matchDescription: "红香细剥莺哥嘴，嫩白鲜羹玉面条。对于学校各种各样的面条，你最喜欢吃哪一种，为你喜欢的面条投上宝贵的一票吧！",
	totalDishes: 30,
	totalVotes: 352,
	totalComments: 98,
	matchCreator: "南京邮电大学",
	isStar: true,
	labelKind: 0,
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南三新开的羊杂面真的巨好吃”",
	matchKind: "面食评比赛",
	isOwn:true
}, {
	mid: 1000021,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCf51t.jpg",
	title: "甜到我心里",
	startTime: 1651715800000,
	endTime: 1670256000000,
	totalDishes: 30,
	totalVotes: 338,
	totalComments: 111,
	labelKind: 0, //0无，1投票，2评论，3收藏
	votableNumber: 1, //代表用户可投票数,
	hotCommond: "“聚甜斋蛋糕永远的神，特别是新出的抹茶甜甜蛋糕”",
	matchDescription: "幸福就是甜品的味道;每一道甜品都有一个故事,对于学校各式各样的甜品，你最喜欢品尝哪一种，为它投上宝贵的一票吧！",
	matchKind: "甜品评比赛"
}, {
	mid: 1000022,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYjOC.png",
	title: "面条嗦起来",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 329,
	totalComments: 101,
	labelKind: 1, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“新开的羊杂面真的巨好吃！”",
	matchKind: "面食评比赛"
}, {
	mid: 1000023,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYkGK.png",
	title: "地方菜我最知道",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 329,
	totalComments: 101,
	labelKind: 2, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南二2楼的川菜鱼香肉丝必须有排面！”",
	matchKind: "特色菜评比赛"
}, {
	mid: 1000024,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYVNo.png",
	title: "早餐吃好又吃饱",
	startTime: 1651715800000,
	endTime: 1673083200000,
	totalDishes: 30,
	totalVotes: 248,
	totalComments: 101,
	labelKind: 0, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南二1楼的夫子面每天早上人巨多。”",
	matchKind: "早餐评比赛"
}, {
	mid: 1000025,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYhES.png",
	title: "谁是南邮汉堡王",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 248,
	totalComments: 101,
	labelKind: 3, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“堡马先生也还行。”",
	matchKind: "汉堡评比赛",
	isOwn:true
},{
	mid: 1000011,
	title: "南邮“面王”评比大赛",
	startTime: 1651715800000,
	endTime: 1671715800000,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYKbT.png",
	matchDescription: "红香细剥莺哥嘴，嫩白鲜羹玉面条。对于学校各种各样的面条，你最喜欢吃哪一种，为你喜欢的面条投上宝贵的一票吧！",
	totalDishes: 30,
	totalVotes: 352,
	totalComments: 98,
	matchCreator: "南京邮电大学",
	isStar: true,
	labelKind: 0,
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南三新开的羊杂面真的巨好吃”",
	matchKind: "面食评比赛",
	isOwn:true
}, {
	mid: 1000012,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCf51t.jpg",
	title: "甜到我心里",
	startTime: 1651715800000,
	endTime: 1670256000000,
	totalDishes: 30,
	totalVotes: 338,
	totalComments: 111,
	labelKind: 0, //0无，1投票，2评论，3收藏
	votableNumber: 1, //代表用户可投票数,
	hotCommond: "“聚甜斋蛋糕永远的神，特别是新出的抹茶甜甜蛋糕”",
	matchDescription: "幸福就是甜品的味道;每一道甜品都有一个故事,对于学校各式各样的甜品，你最喜欢品尝哪一种，为它投上宝贵的一票吧！",
	matchKind: "甜品评比赛"
}, {
	mid: 1000013,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYjOC.png",
	title: "面条嗦起来",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 329,
	totalComments: 101,
	labelKind: 1, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“新开的羊杂面真的巨好吃！”",
	matchKind: "面食评比赛"
}, {
	mid: 1000014,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYkGK.png",
	title: "地方菜我最知道",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 329,
	totalComments: 101,
	labelKind: 2, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南二2楼的川菜鱼香肉丝必须有排面！”",
	matchKind: "特色菜评比赛"
}, {
	mid: 1000015,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYVNo.png",
	title: "早餐吃好又吃饱",
	startTime: 1651715800000,
	endTime: 1673083200000,
	totalDishes: 30,
	totalVotes: 248,
	totalComments: 101,
	labelKind: 0, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南二1楼的夫子面每天早上人巨多。”",
	matchKind: "早餐评比赛"
}, {
	mid: 1000016,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYhES.png",
	title: "谁是南邮汉堡王",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 248,
	totalComments: 101,
	labelKind: 3, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“堡马先生也还行。”",
	matchKind: "汉堡评比赛",
	isOwn:true
},{
	mid: 1000030,
	title: "南邮“面王”评比大赛",
	startTime: 1651715800000,
	endTime: 1671715800000,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYKbT.png",
	matchDescription: "红香细剥莺哥嘴，嫩白鲜羹玉面条。对于学校各种各样的面条，你最喜欢吃哪一种，为你喜欢的面条投上宝贵的一票吧！",
	totalDishes: 30,
	totalVotes: 352,
	totalComments: 98,
	matchCreator: "南京邮电大学",
	isStar: true,
	labelKind: 0,
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南三新开的羊杂面真的巨好吃”",
	matchKind: "面食评比赛",
	isOwn:true
}, {
	mid: 1000031,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCf51t.jpg",
	title: "甜到我心里",
	startTime: 1651715800000,
	endTime: 1670256000000,
	totalDishes: 30,
	totalVotes: 338,
	totalComments: 111,
	labelKind: 0, //0无，1投票，2评论，3收藏
	votableNumber: 1, //代表用户可投票数,
	hotCommond: "“聚甜斋蛋糕永远的神，特别是新出的抹茶甜甜蛋糕”",
	matchDescription: "幸福就是甜品的味道;每一道甜品都有一个故事,对于学校各式各样的甜品，你最喜欢品尝哪一种，为它投上宝贵的一票吧！",
	matchKind: "甜品评比赛"
}, {
	mid: 1000032,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYjOC.png",
	title: "面条嗦起来",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 329,
	totalComments: 101,
	labelKind: 1, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“新开的羊杂面真的巨好吃！”",
	matchKind: "面食评比赛"
}, {
	mid: 1000033,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYkGK.png",
	title: "地方菜我最知道",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 329,
	totalComments: 101,
	labelKind: 2, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南二2楼的川菜鱼香肉丝必须有排面！”",
	matchKind: "特色菜评比赛"
}, {
	mid: 1000034,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYVNo.png",
	title: "早餐吃好又吃饱",
	startTime: 1651715800000,
	endTime: 1673083200000,
	totalDishes: 30,
	totalVotes: 248,
	totalComments: 101,
	labelKind: 0, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南二1楼的夫子面每天早上人巨多。”",
	matchKind: "早餐评比赛"
}, {
	mid: 1000035,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYhES.png",
	title: "谁是南邮汉堡王",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 248,
	totalComments: 101,
	labelKind: 3, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“堡马先生也还行。”",
	matchKind: "汉堡评比赛",
	isOwn:true
},{
	mid: 1000040,
	title: "南邮“面王”评比大赛",
	startTime: 1651715800000,
	endTime: 1671715800000,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYKbT.png",
	matchDescription: "红香细剥莺哥嘴，嫩白鲜羹玉面条。对于学校各种各样的面条，你最喜欢吃哪一种，为你喜欢的面条投上宝贵的一票吧！",
	totalDishes: 30,
	totalVotes: 352,
	totalComments: 98,
	matchCreator: "南京邮电大学",
	isStar: true,
	labelKind: 0,
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南三新开的羊杂面真的巨好吃”",
	matchKind: "面食评比赛",
	isOwn:true
}, {
	mid: 1000041,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCf51t.jpg",
	title: "甜到我心里",
	startTime: 1651715800000,
	endTime: 1670256000000,
	totalDishes: 30,
	totalVotes: 338,
	totalComments: 111,
	labelKind: 0, //0无，1投票，2评论，3收藏
	votableNumber: 1, //代表用户可投票数,
	hotCommond: "“聚甜斋蛋糕永远的神，特别是新出的抹茶甜甜蛋糕”",
	matchDescription: "幸福就是甜品的味道;每一道甜品都有一个故事,对于学校各式各样的甜品，你最喜欢品尝哪一种，为它投上宝贵的一票吧！",
	matchKind: "甜品评比赛"
}, {
	mid: 1000042,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYjOC.png",
	title: "面条嗦起来",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 329,
	totalComments: 101,
	labelKind: 1, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“新开的羊杂面真的巨好吃！”",
	matchKind: "面食评比赛"
}, {
	mid: 1000043,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYkGK.png",
	title: "地方菜我最知道",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 329,
	totalComments: 101,
	labelKind: 2, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南二2楼的川菜鱼香肉丝必须有排面！”",
	matchKind: "特色菜评比赛"
}, {
	mid: 1000044,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYVNo.png",
	title: "早餐吃好又吃饱",
	startTime: 1651715800000,
	endTime: 1673083200000,
	totalDishes: 30,
	totalVotes: 248,
	totalComments: 101,
	labelKind: 0, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“南二1楼的夫子面每天早上人巨多。”",
	matchKind: "早餐评比赛"
}, {
	mid: 1000045,
	posterUrl: "https://www.helloimg.com/images/2023/01/05/oCYhES.png",
	title: "谁是南邮汉堡王",
	startTime: 1651715800000,
	endTime: 1670083200000,
	totalDishes: 30,
	totalVotes: 248,
	totalComments: 101,
	labelKind: 3, //0无，1投票，2评论，3收藏
	votableNumber: 2, //代表用户可投票数,
	hotCommond: "“堡马先生也还行。”",
	matchKind: "汉堡评比赛",
	isOwn:true
}]
export default (option) => {
	let reqName = option.url.split('/')[2]
	reqName = reqName.split('?')[0]
	if (option.type == 'GET') {
		if (reqName === 'matchDetail') {
			const {
				mid
			} = param2Obj(option.url)
			let index = List.findIndex((item) => item.mid == mid)
			if (index != -1) {
				return {
					code: 200,
					data: {
						match: List[index]
					}
				}
			} else
				return {
					code: 500,
					message: "查找出错"
				}

		} else if (reqName === 'votableNumber') {
			const {
				mid
			} = param2Obj(option.url)
			let index = List.findIndex((item) => item.mid == mid)
			if (List[index].votableNumber > 0)
				List[index].votableNumber--
			return {
				code: 200,
				data: {
					votableNumber: List[[index]].votableNumber
				}
			}
		} else if (reqName === 'matches') {
			console.log(param2Obj(option.url));
			const {
				searchName,
				page = 1,
				limit = 20,
				userStatus
			} = param2Obj(option.url)
			let stateList=JSON.parse(JSON.stringify(List))
			if(userStatus==2){
				stateList=List.filter(match=> match.isOwn===true)
			}
			const mockList = stateList.filter(match => {
				if (searchName && match.title.indexOf(searchName) === -1) return false 
				return true
			})
			const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
			return {
				code: 200,
				data: {
					matchList: pageList,
					listCount: mockList.length
				}
			}
		}

	} else if (option.type == 'POST') {
		if (reqName === 'matchDetail') {} else if (reqName === 'starMatch') {
			let {
				mid
			} = option.body
			List[0].isStar = !List[0].isStar
			return {
				code: 200,
				data: {},
				message: "收藏成功"
			}
		}
		if (reqName === 'setMatch') {
			
			if (typeof option.body.match === "object") {
				let match ={...option.body.match}
				match.totalDishes = 0
				match.totalVotes = 0
				match.totalComments = 0
				match.hotCommond = ""
				match.labelKind = 0
				match.mid = 1000000 + Math.round(Math.random() * 899999)
				List.unshift(match)
				return {
					code: 200,
					data: {},
					message: "发布成功"
				}
			} else
				return {
					code: 500,
					data: {},
					message: "数据出错"
				}
		} else if (reqName === 'updateMatch') {
			let {
				mid,
				title,
				startTime,
				endTime,
				matchDescription,
				matchKind,
				matchCreator,
				posterUrl,
				votableNumber
			} = option.body.match
			let index = List.findIndex((item) => item.mid === mid)
			if (index != -1) {
				List[index].title = title
				List[index].startTime = startTime
				List[index].endTime = endTime
				List[index].matchDescription = matchDescription
				List[index].matchKind = matchKind
				List[index].matchCreator = matchCreator
				List[index].posterUrl = posterUrl
				List[index].votableNumber = votableNumber
				return {
					code: 200,
					message: "修改成功"
				}
			} else
				return {
					code: "500",
					message: "查找错误"
				}
		} else if (reqName === 'deleteMatch') {
			let {
				mid
			} = option.body
			let index = List.findIndex((item) => item.mid === mid)
			if (index != -1) {
				List.splice(index, 1)
				return {
					code: 200,
					message: "删除成功"
				}
			} else
				return {
					code: 500,
					message: "删除失败"
				}

		}
	}
}
