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
		did: 100001,
		imgUrl: "https://www.helloimg.com/images/2023/01/05/oCfRRE.png",
		dishName: "兰州拉面",
		address: "南二2楼",
		voteCount: 72,
		commendCount: 32,
		hotComment: "兰州人表示很赞！",
		dishDescription: "以肉烂汤鲜,面质精细而蜚声中外，赢得了国内乃至全世界范围内食客的好评和荣誉。",
		isVote: false //true表示这个菜品被用户投过票了
	},
	{
		did: 100003,
		imgUrl: "https://www.helloimg.com/images/2023/01/05/oCfBbu.png",
		dishName: "重庆小面",
		address: "南三2楼",
		voteCount: 88,
		commendCount: 43,
		hotComment: "重庆小面yyds！",
		dishDescription: "重庆四大特色之一。在早餐较常见。作为南方人的重庆市民普遍接受的传统面食，重庆小面因其独特口感，以辣闻名，近年来全国知名。",
		isVote: true //true表示这个菜品被用户投过票了
	},
	{
		did: 100005,
		imgUrl: "https://www.helloimg.com/images/2023/01/05/oCfCIv.png",
		dishName: "炸酱面",
		address: "南二1楼",
		voteCount: 62,
		commendCount: 32,
		hotComment: "味道真的不错。",
		dishDescription: "中国传统特色面食，被誉为中国十大面条之一",
		isVote: false //true表示这个菜品被用户投过票了
	},
	{
		did: 100010,
		imgUrl: "https://www.helloimg.com/images/2023/01/05/oCfZAY.png",
		dishName: "羊杂面",
		address: "南三2楼",
		voteCount: 109,
		commendCount: 62,
		hotComment: "羊杂面的味道真的绝！",
		dishDescription: "以面条，香葱主料制作的药膳。是一道具有延缓衰老功效的药膳面食，有益于补心益肾",
		isVote: true //true表示这个菜品被用户投过票了
	}
]
export default (option) => {
	let reqName = option.url.split('/')[2]
	reqName = reqName.split('?')[0]
	if (option.type == 'GET') {
		if (reqName === 'matchDishes') {
			const {
				mid
			} = param2Obj(option.url)
			return {
				code: 200,
				data: {
					dishList: List
				}
			}
		}
	} else if (option.type == 'POST') {
		if (reqName === 'voteDish') {
			let {
				did
			} = option.body
			let commentIndex = List.findIndex((item, index) => {
				return item.did === did
			})
			if (commentIndex != -1) {
				List[commentIndex].voteCount++
				List[commentIndex].isVote = true
				return {
					code: 200,
					data: {},
					message: "投票成功"
				}
			} else {
				return {
					code: 501,
					data: {},
					message: "未登录"
				}
			}
		} else if (reqName === "updateDish") {
			console.log(option.body);
			let {
				did,
				imgUrl,
				dishName,
				address,
				voteCount,
				commentCount,
				hotComment,
				dishDescription
			} = option.body.dish
			let index = List.findIndex((item) => item.did === did)
			if (index != -1) {
				List[index].imgUrl = imgUrl
				List[index].dishName = dishName
				List[index].address = address
				List[index].voteCount = voteCount
				List[index].commentCount = commentCount
				List[index].hotComment = hotComment
				List[index].dishDescription = dishDescription
				return {
					code: 200,
					message: "修改成功"
				}
			} else
				return {
					code: "500",
					message: "查找错误"
				}
		}else if (reqName === 'deleteDish') {
			console.log(option.body);
			let {
				did
			} = option.body
			let index = List.findIndex((item) => item.did === did)
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
		}else if (reqName === 'setDish') {
			if (typeof option.body.dish === "object") {
				let dish ={...option.body.dish}
				dish.voteCount = 0
				dish.commentCount = 0
				dish.hotComment = ""
				dish.isVote = false
				dish.did = 1000000 + Math.round(Math.random() * 899999)
				List.unshift(dish)
				return {
					code: 200,
					data: {},
					message: "参加成功"
				}
			} else
				return {
					code: 500,
					data: {},
					message: "数据出错"
				}
		}
	}

}
