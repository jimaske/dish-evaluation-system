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
let dishList = [{
	id: 100001,
	dishName: "兰州拉面"
}, {
	id: 100003,
	dishName: "重庆小面",
}, {
	id: 100005,
	dishName: "炸酱面"
}, {
	id: 100010,
	dishName: "羊杂面"
}]
let matchList = [{
	mid: 1000010,
	title: "南邮“面王”评比大赛",
},{
	mid: 1000001,
	matchName: "甜到我心里"
}, {
	mid: 1000002,
	matchName: "面条嗦起来"
}, {
	mid: 1000003,
	matchName: "地方菜我最知道"
}, {
	mid: 1000004,
	matchName: "早餐吃好又吃饱"
}, {
	mid: 1000005,
	matchName: "谁是南邮汉堡王"
}]
let List = [{
		id: 100001,
		avatarUrl: "https://www.helloimg.com/images/2023/01/12/oGW8eq.png",
		userName: "会打篮球的鸡",
		level: 5,
		status:0,
		signature: "一个真正点评的man",
		account: "123456",
		password: "e10adc3949ba59abbe56e057f20f883e",
		starList: [{
			mid: 1000001, //比赛id
			title: "甜到我心里",
			imgUrl: "https://www.helloimg.com/images/2023/01/05/oCf51t.jpg",
			startTime: 1670435875914,
			endTime: 1671256000000,
			voteCount: 338,
			commentCount: 111
		}, {
			mid: 1000002, //比赛id
			title: "面条嗦起来",
			imgUrl: "https://www.helloimg.com/images/2023/01/05/oCYjOC.png",
			startTime: 1670635875914,
			endTime: 1671083200000,
			voteCount: 329,
			commentCount: 101
		}, {
			mid: 1000004, //比赛id
			title: "面条嗦起来",
			imgUrl: "https://www.helloimg.com/images/2023/01/05/oCYVNo.png",
			startTime: 1671635875914,
			endTime: 1673083200000,
			voteCount: 248,
			commentCount: 101
		}, {
			mid: 1000010,
			title: "南邮“面王”评比大赛",
			imgUrl: "https://www.helloimg.com/images/2023/01/05/oCYKbT.png",
			startTime: 1671315800000,
			endTime: 1671715800000,
			voteCount: 248,
			commentCount: 101
		}],
		historyList: [{
				id: 1000010, //比赛id
				dishName: ["重庆小面", "羊杂面"],
				matchName: "南邮“面王”评比大赛",
				imgUrl: "https://www.helloimg.com/images/2023/01/05/oCYKbT.png",
				voteTime: 1673228761000
			},
			{
				id: 1000003, //比赛id
				dishName: ["隆江猪脚饭"],
				matchName: "地方菜我最知道",
				imgUrl: "https://www.helloimg.com/images/2023/01/05/oCYkGK.png",
				voteTime: 1669436542923
			}, {
				id: 1000001, //比赛id
				dishName: ["抹茶蛋糕"],
				matchName: "甜到我心里",
				imgUrl: "https://www.helloimg.com/images/2023/01/05/oCf51t.jpg",
				voteTime: 1673320340638
			}, {
				id: 1000005, //比赛id
				dishName: ["堡马先生"],
				matchName: "谁是南邮汉堡王",
				imgUrl: "https://www.helloimg.com/images/2023/01/05/oCYhES.png",
				voteTime: 1673315161000

			}
		],
		commentList: [{
				cid: 717278,
				mid: 1000010, //比赛id
				dishName: "炸酱面",
				matchName: "面条嗦起来",
				time: 1672474224135,
				commentContent: "每次打篮球回来没啥胃口，就会点一份来吃，挺不错的。",
				likeCount: 6,
				isLiked: false
			},
			{
				cid: 737174,
				mid: 1000010, //比赛id
				dishName: "重庆小面",
				matchName: "南邮“面王”评比大赛",
				time: 1669436600914,
				commentContent: "重庆小面在学校里还是非常不错滴！",
				likeCount: 10, //点赞数
				isLiked: true //false表示自己没有给这条评论点赞
			},
			{
				cid: 737176,
				mid: 1000001, //比赛id
				dishName: "",
				matchName: "甜到我心里",
				time: 1673238761000,
				commentContent: "南二一楼那家蛋糕店没有参赛挺可惜，里面蛋糕挺好吃的！",
				likeCount: 0, //点赞数
				isLiked: false, //false表示自己没有给这条评论点赞
			}
		]
	},
	{
		id: 100003,
		avatarUrl: "../../static/user-avatar2.png",
		userName: "重庆小面（南二2楼）",
		status:1,
		level: 5,
		signature: "做最好吃的小面",
		account: "654321",
		password: "c33367701511b4f6020ec61ded352059",
	},
	{
		id: 100005,
		avatarUrl: "../../static/user-avatar3.png",
		userName: "南京邮电大学",
		status:2,
		account: "666666",
		password: "f379eaf3c831b04de153469d1bec345e",
	}
]
let userToken = ["DFGHJKRTYUIOMNBVCX", "QWERTYUIJHGFDS", "ZXCVBNJHGFSDQWER"]
let userIndex = -1
export default (option) => {
	let reqName = option.url.split('/')[2]
	reqName = reqName.split('?')[0]
	if (option.type == 'GET') {
		if (reqName === 'loginStatus') {
			const {
				token
			} = param2Obj(option.url)
			userIndex = userToken.indexOf(token)
			if (userIndex != -1)
				return {
					code: 200,
					data: {
						user: {
							userName: List[userIndex].userName,
							signature: List[userIndex].signature,
							avatarUrl: List[userIndex].avatarUrl,
							level: List[userIndex].level,
							status:List[userIndex].status
						}
					}
				}
			else {
				return {
					code: 501,
					message: "未登录"
				}
			}
		} else if (reqName === 'starList') {
			if (userIndex != -1)
				return {
					code: 200,
					data: {
						starList: List[userIndex].starList
					}
				}
			else
				return {
					code: 501,
					message: "未登录"
				}
		} else if (reqName === 'voteHistoryList') {
			if (userIndex != -1)
				return {
					code: 200,
					data: {
						historyList: List[userIndex].historyList
					}
				}
			else
				return {
					code: 501,
					message: "未登录"
				}
		} else if (reqName === 'myCommentList') {
			if (userIndex != -1)
				return {
					code: 200,
					data: {
						commentList: List[userIndex].commentList
					}
				}
			else
				return {
					code: 501,
					message: "未登录"
				}
		} else if (reqName === 'getUserInfo') {
			if (userIndex != -1)
				return {
					code: 200,
					data: {
						user: {
							userName: List[userIndex].userName,
							signature: List[userIndex].signature,
							avatarUrl: List[userIndex].avatarUrl,
							level: List[userIndex].level
						}
					}
				}
			else {
				return {
					code: 501,
					message: "未登录"
				}
			}
		} else if (reqName = 'getUser') {
			return {
				code: 200,
				message: ""
			}
		}

	} else if (option.type == 'POST') {
		if (reqName == 'login') {
			let {
				account,
				password
			} = option.body
			userIndex = List.findIndex(item => item.account === account)
			if (userIndex != -1) {
				if (List[userIndex].password === password)
					return {
						code: 200,
						data: {
							token: userToken[userIndex]
						}
					}
				else
					return {
						code: 502,
						data: {},
						message: "账号或密码错误"
					}
			} else
				return {
					code: 502,
					data: {},
					message: "账号或密码错误"
				}
		} else if (reqName == 'cancelStarMatch') {
			let {
				mid
			} = option.body
			if (mid && userIndex != -1) {
				let index = List[userIndex].starList.findIndex(item => item.mid === mid)
				List[userIndex].starList.splice(index, 1);
				return {
					code: 200,
					message: "删除成功"
				}
			} else
				return {
					code: 500,
					message: "删除失败"
				}
		} else if (reqName == 'commentDish') {//评论作品
		console.log(option.body);
			let {
				did,
				mid,
				commentContent
			} = option.body
			let dishIndex = dishList.findIndex(item => item.id == did)
			let matchIndex = matchList.findIndex(item => item.mid == mid)
			let dishName = dishIndex == -1 ? "" : dishList[dishIndex].dishName
			let length = List[0].commentList.length
			let commentItem = {
				cid: List[0].commentList[length - 1].cid + 3,
				mid, //比赛id
				dishName,
				matchName: matchList[matchIndex].matchName,
				time: new Date().getTime(),
				commentContent,
				likeCount: 0, //点赞数
				isLiked: false //false表示自己没有给这条评论点赞
			}
			List[0].commentList.push(commentItem)
		} else if (reqName === 'deleteComment') {
			let {
				cid
			} = option.body
			if (cid && userIndex != -1) {
				let commentIndex = List[userIndex].commentList.findIndex(item => item.cid == cid)
				if (commentIndex != -1) {
					List[userIndex].commentList.splice(commentIndex, 1)
					return {
						code: 200,
						message: "删除成功"
					}
				} else
					return {
						code: 502,
						message: "找不到该评论"
					}

			} else {
				return {
					code: 501,
					message: "未登录"
				}
			}
		} else if (reqName == 'commentLike' || reqName == 'cancelCommentLike') {
			let {
				cid
			} = option.body
			let commentIndex = List[userIndex].commentList.findIndex(item => item.cid === cid)
			if (commentIndex != -1) {
				if (List[userIndex].commentList[commentIndex].isLiked) {
					List[userIndex].commentList[commentIndex].isLiked = false
					List[userIndex].commentList[commentIndex].likeCount--
				} else {
					List[userIndex].commentList[commentIndex].isLiked = true
					List[userIndex].commentList[commentIndex].likeCount++
				}
			}
		} else if (reqName == 'uploadAvatar') {
			if (1) {
				return {
					code: 200,
					data: {
						avatarUrl: "https://www.helloimg.com/images/2023/01/12/oGWK2r.png" //上传成功后的新头像地址
					}
				}
			} else {
				return {
					code: 501,
					data: {
						avatarUrl: "https://www.helloimg.com/images/2023/01/12/oGWK2r.png" //上传成功后的新头像地址
					},
					message: "未登录"
				}
			}


		} else if (reqName == 'edit') {
			if (userIndex != -1) {
				for (let key in option.body) {
					List[userIndex][key] = option.body[key]
				}
				return {
					code: 200,
					message: "修改成功"
				}
			} else {
				return {
					code: 501,
					data: {},
					message: "未登录"
				}
			}
			for (let key in option.body) {
				arrayColors.push(key);
			}
		} else if (reqName == 'register') {
			let {
				account,
				password
			} = option.body
			List.push({
				id: 100030,
				avatarUrl: "https://www.helloimg.com/images/2023/01/12/oGW8eq.png",
				userName: "用户0606",
				level: 0,
				signature: null,
				account,
				password,
				starList: [],
				historyList: [],
				commentList: []
			})
			userToken.push("FHUEJHDBKPOG")
			return {
				code: 200,
				message: "注册成功"
			}
		}

	}

}
