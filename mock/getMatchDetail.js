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
let match = {
	id: 1000005,
	title: "南邮“面王”评比大赛",
	endTime: 1671715800000,
	posterUrl:"https://www.helloimg.com/images/2023/01/05/oCYKbT.png",
	matchDescription: "红香细剥莺哥嘴，嫩白鲜羹玉面条。对于学校各种各样的面条，你最喜欢吃哪一种，为你喜欢的面条投上宝贵的一票吧！",
	totalDishes: 30,
	totalVotes: 352,
	totalComments: 98,
	matchCreator: "南京邮电大学",
	isStar: true,
	votableNumber:1 //代表用户可投票数
}
export default (option) => {
	let reqName = option.url.split('/')[2]
	reqName = reqName.split('?')[0]
	if (option.type == 'GET') {
		if (reqName == 'matchDetail'){
			const {
				mid
			} = param2Obj(option.url)
			return {
				code: 200,
				data: {
					match:match
				}
			}
		}else if(reqName == 'votableNumber'){
			
			if(match.votableNumber>0)
				match.votableNumber--
			return {
				code: 200,
				data: {
					votableNumber:match.votableNumber
				}
			}
		}
		
	} else if (option.type == 'POST') {
		let {
			mid
		} = option.body
		match.isStar=!match.isStar
		return {
			code: 200,
			data:{},
			message:"收藏成功"
		}
	}

}
