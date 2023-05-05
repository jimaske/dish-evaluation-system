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
		id: 757575,
		avatarUrl: "https://www.helloimg.com/images/2023/01/12/oGWK2r.png",
		userName: "姬霓钛镁",
		createTime: 1671373996000,
		likeCount: 111,
		commentContent: "重庆小面是从南二搬过去的，还是原来的味道，每周至少点一次。",
		linkFlag: true,
		linkDishName: "重庆小面",
		linkDishId: 100003,
		linkDishAddress: "南三2楼",
		isLike: false, //false表示用户目前对该评论没有点赞  
		isOwn:false
	},
	{
		id: 737275,
		avatarUrl: "https://www.helloimg.com/images/2023/01/12/oGW8eq.png",
		userName: "匿名用户",
		createTime: 1671522274022,
		likeCount: 21,
		linkDishId: 100010,
		commentContent: "第一次吃就给我留下了深刻印象，它的面条比学校其他店的面条细一点，口感正好，个人超级喜欢！",
		linkFlag: true,
		linkDishName: "羊杂面",
		linkDishAddress: "南三2楼",
		isOwn:false,
		isLike: true //false表示用户目前对该评论没有点赞  
	},
	{
		id: 717275,
		avatarUrl: "https://www.helloimg.com/images/2023/01/12/oGWIYc.png",
		userName: "行走的鱼",
		createTime: 1620287074000,
		likeCount: 35,
		linkDishId: 100005,
		commentContent: "价格实惠，量也不少，不想吃饭的时候点一下吃还是不错的。",
		linkFlag: true,
		linkDishName: "炸酱面",
		linkDishAddress: "南二1楼",
		isOwn:false,
		isLike: false //false表示用户目前对该评论没有点赞  
	},
	{
		id: 717278,
		avatarUrl: "https://www.helloimg.com/images/2023/01/12/oGW8eq.png",
		userName: "会打篮球的鸡",
		createTime: 1672474224135,
		likeCount: 6,
		linkDishId: 100005,
		commentContent: "每次打篮球回来没啥胃口，就会点一份来吃，挺不错的。",
		linkFlag: true,
		linkDishName: "炸酱面",
		linkDishAddress: "南二1楼",
		isOwn:true,
		isLike: false //false表示用户目前对该评论没有点赞  
	},
	{
		id: 737176,
		avatarUrl: "https://www.helloimg.com/images/2023/01/12/oGWK2r.png",
		userName: "下地的鸟",
		createTime: 1671544575278,
		likeCount: 15,
		commentContent: "为啥没有南一二楼新开的牛肉面啊，超喜欢他们家的面。",
		linkFlag: false,
		isOwn:false,
		isLike: false //false表示用户目前对该评论没有点赞  
	}
]
export default (option) => {
	let reqName = option.url.split('/')[2]
	reqName = reqName.split('?')[0]
	if (option.type == 'GET') {
		const {
			did,
			mid,
			page = 1,
			limit = 20
		} = param2Obj(option.url)
		const mockList = List.filter(comment => {
			if (did && comment.linkDishId != did) return false
			return true
		})
		const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
		return {
			code: 200,
			data: {
				commentList: pageList
			}
		}
	} else if (option.type == 'POST') {
		if (reqName == 'commentLike' || reqName == 'cancelCommentLike') {
			let {
				cid
			} = option.body
			let commentIndex = List.findIndex((item, index) => {
				return item.id === cid
			})
			if (commentIndex != -1) {
				if (List[commentIndex].isLike) {
					List[commentIndex].likeCount--
					List[commentIndex].isLike = false
					return {
						code: 200,
						data: {},
						message: "取消点赞"
					}
				} else {
					List[commentIndex].likeCount++
					List[commentIndex].isLike = true;
					return {
						code: 200,
						data: {},
						message: "点赞成功"
					}
				}
			}
		} else if (reqName == 'commentDish') {
			let {
				did,
				mid,
				commentContent
			} = option.body
			let linkFlag = did === 0 ? false : true;
			let linkDishName=''
			let linkDishAddress=''
			if(did==100001){
				linkDishName="兰州拉面",
				linkDishAddress="南二2楼"
			}
			else if(did==100003){
				linkDishName="重庆小面",
				linkDishAddress="南三2楼"
			}else if(did==100005){
				linkDishName="炸酱面",
				linkDishAddress="南二1楼"
			}else if(did==100010){
				linkDishName="羊杂面",
				linkDishAddress="南三2楼"
			}
			
			let commentItem = {
				id: List[List.length - 1].id + 3,
				avatarUrl: "../../static/uni.png",
				userName: "打篮球的鸡",
				createTime: new Date().getcreateTime(),
				likeCount: 0,
				linkDishId: did,
				linkDishName,
				linkDishAddress,
				commentContent,
				linkFlag,
				isLike: false, //false表示用户目前对该评论没有点赞  
				isOwn:true
			}
			List.push(commentItem)
			return {
				code: 200,
				message: '发布成功'
			}
		}else if(reqName === 'deleteComment'){
			let {cid} = option.body
			
			let commentIndex=List.findIndex(item=>item.id==cid)
			List.splice(commentIndex,1)
		}


	}

}
