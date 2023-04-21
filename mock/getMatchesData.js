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
		id: 1000001,
		imgUrl: "https://www.helloimg.com/images/2023/01/05/oCf51t.jpg",
		title: "甜到我心里",
		endTime: 1670256000000,
		voteCount: 338,
		commentCount: 111,
		labelKind: 0, //0无，1投票，2评论，3收藏
		hotCommond: "“聚甜斋蛋糕永远的神，特别是新出的抹茶甜甜蛋糕”",
		matchKind: "甜品评比赛"
	}, {
		id: 1000002,
		imgUrl: "https://www.helloimg.com/images/2023/01/05/oCYjOC.png",
		title: "面条嗦起来",
		endTime: 1670083200000,
		voteCount: 329,
		commentCount: 101,
		labelKind: 1, //0无，1投票，2评论，3收藏
		hotCommond: "“新开的羊杂面真的巨好吃！”",
		matchKind: "面食评比赛"
	},
	{
		id: 1000003,
		imgUrl: "https://www.helloimg.com/images/2023/01/05/oCYkGK.png",
		title: "地方菜我最知道",
		endTime: 1670083200000,
		voteCount: 329,
		commentCount: 101,
		labelKind: 2, //0无，1投票，2评论，3收藏
		hotCommond: "“南二2楼的川菜鱼香肉丝必须有排面！”",
		matchKind: "特色菜评比赛"
	},
	{
		id: 1000004,
		imgUrl: "https://www.helloimg.com/images/2023/01/05/oCYVNo.png",
		title: "早餐吃好又吃饱",
		endTime: 1673083200000,
		voteCount: 248,
		commentCount: 101,
		labelKind: 0, //0无，1投票，2评论，3收藏
		hotCommond: "“南二1楼的夫子面每天早上人巨多。”",
		matchKind: "早餐评比赛"
	},
	{
		id: 1000005,
		imgUrl: "https://www.helloimg.com/images/2023/01/05/oCYhES.png",
		title: "谁是南邮汉堡王",
		endTime: 1670083200000,
		voteCount: 248,
		commentCount: 101,
		labelKind: 3, //0无，1投票，2评论，3收藏
		hotCommond: "“堡马先生也还行。”",
		matchKind: "汉堡评比赛"
	}
]
export default (option) => {
	const {
		searchName,
		page = 1,
		limit = 20
	} = param2Obj(option.url)
	const mockList = List.filter(match => {
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
