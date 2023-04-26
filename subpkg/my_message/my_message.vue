<template>
	<van-tabs @change="onChange"><!-- @disabled="onClickDisabled" -->
		<van-tab
			:title="userInfo.status===0?`点赞${msgNumList.likeList>0?'('+msgNumList.likeList+')':''}` :`投票${msgNumList.voteList>0?'('+msgNumList.voteList+')':''}`">
			<view v-if="userInfo.status===0" class="like-list">
				<view v-for="(item,index) in likeList" class="like-item item" :key="index">
					<view v-if="item.length>=2" class="left-and-center">
						<view class="left">
							<image class="left-img" :src="item[0].avatarUrl" mode=""></image>
							<image class="right-img" :src="item[1].avatarUrl" mode=""></image>
						</view>
						<view class="center">
							<text style="font-weight:600 ;">{{`${item[0].userName}、${item[1].userName }`}}</text>
							等总计{{item.length}}人赞了我的评论
						</view>
					</view>
					<view v-if="item.length==1" class="left-and-center">
						<view class="left">
							<image class="center-img" :src="item[0].avatarUrl" mode=""></image>
						</view>
						<view class="center">
							<text style="font-weight:600 ;">{{item[0].userName}}</text> 赞了我的评论
						</view>
					</view>
					<view class="right">{{item[0].commentContent}}</view>
				</view>
			</view>
			<view v-else class="vote-list">
				<view v-for="(item,index) in voteList" class="vote-item item" :key="index">
					<view v-if="item.length>=2" class="left-and-center">
						<view class="left">
							<image class="left-img" :src="item[0].avatarUrl" mode=""></image>
							<image class="right-img" :src="item[1].avatarUrl" mode=""></image>
						</view>
						<view class="center">
							<text style="font-weight:600 ;">{{`${item[0].userName}、${item[1].userName }`}}</text>
							等总计{{item.length}}人投票了我的{{userInfo.status==1?'作品':'比赛'}}
						</view>
					</view>
					<view v-if="item.length==1" class="left-and-center">
						<view class="left">
							<image class="center-img" :src="item[0].avatarUrl" mode=""></image>
						</view>
						<view class="center">
							<text style="font-weight:600 ;">{{item[0].userName}}</text>
							投票了我的{{userInfo.status==1?'作品':'比赛'}}
						</view>
					</view>
					<view class="right">
						<image class="rig-img" :src="item[0].imgUrl" mode="cover"></image>
					</view>
				</view>
			</view>
		</van-tab>
		<van-tab :title="`评论${msgNumList.commentList>0?'('+msgNumList.commentList+')':''}`"
			:disabled="userInfo.status===0">
			<view v-for="(item,index) in commentList" class="commentList-item item" :key="index">
				<view class="left-and-center">
					<view class="left">
						<image class="center-img" :src="item.avatarUrl" mode=""></image>
					</view>
					<view class="center">
						<view style="margin-bottom: 10rpx;">
							<text style="font-weight:600 ;">{{item.userName}}</text>
							评论了我的{{userInfo.status==1?'作品':'比赛'}}
						</view>
						<view class="">
							：{{item.commentContent}}
						</view>
					</view>
				</view>
				<view class="right">
					<image class="rig-img" :src="item.imgUrl" mode="cover"></image>
				</view>
			</view>
		</van-tab>
		<van-tab :title="`相关${msgNumList.dishList>0?'('+msgNumList.dishList+')':''}`" :disabled="userInfo.status===0">
			<view v-if="userInfo.status===1">
				<view v-for="(item,index) in dishList" class="" :key="index">
					<view v-if="item.topOrBottom==='bottom'" class="item">
						<view class="left-and-center">
							<view class="left">
								<image class="center-img no-border" src="../../static/sad.png" mode="aspectFit"></image>
							</view>
							<view class="center">
								<view style="margin-bottom: 10rpx;">
									你的作品 <text style="font-weight:600;">{{item.dishName}}</text> 在 <text
										style="font-weight:600;">{{item.matchName}}</text> 比赛中名次暂处低位，请继续加油！
								</view>
							</view>
						</view>
						<view class="right">
							<image class="rig-img" :src="item.imgUrl" mode="cover"></image>
						</view>
					</view>
					<view v-else class="item">
						<view class="left-and-center">
							<view class="left">
								<image class="center-img no-border" src="../../static/top.png" mode="aspectFit"></image>
							</view>
							<view class="center">
								<view style="margin-bottom: 10rpx;">
									你的作品 <text style="font-weight:600;">{{item.dishName}}</text> 在 <text
										style="font-weight:600;">{{item.matchName}}</text> 比赛中名次暂处第一，请继续保持！
								</view>
							</view>
						</view>
						<view class="right">
							<image class="rig-img" :src="item.imgUrl" mode="cover"></image>
						</view>
					</view>
				</view>
			</view>
			<view v-if="userInfo.status===2">
				<view v-for="(item,index) in dishList" class="dish-item item" :key="index">
					<view v-if="item.length>=2" class="left-and-center">
						<view class="center">
							<text style="font-weight:600 ;">{{`${item[0].dishName}、${item[1].dishName }`}}</text>
							等总计{{item.length}}个作品已加入你创建的比赛 {{item[0].title}}
						</view>
					</view>
					<view v-if="item.length==1" class="left-and-center">
						<view class="center">
							<text style="font-weight:600;">{{item[0].dishName}}</text> 成为你创建的比赛{{item[0].title}}的第一个作品
						</view>
					</view>
					<view class="right">
						<image class="rig-img" :src="item[0].imgUrl" mode="cover"></image>
					</view>
				</view>
			</view>

		</van-tab>
	</van-tabs>

</template>

<script>
	import {
		onLoad,
		onShow,
		onHide,
		onUnload
	} from '@dcloudio/uni-app'
	import {
		computed,
		ref,
		watch,
		reactive,
		toRefs
	} from 'vue'
	import {
		useStore
	} from 'vuex'
	export default {
		setup() {
			const store = useStore()

			let list = computed(() => store.state.user.msgList)

			let userInfo = computed(() => store.state.user.userInfo)

			let msgList = reactive({
				likeList: [],
				commentList: [],
				voteList: [],
				dishList: []
			})
			watch(list, (newValue) => {
				function recombinArray(list, fn) { //按照相同的特征抽离数组再重组新数组
					return list.reduce((a, b) => {
						let index = a.findIndex(item => fn(item, b))
						if (index === -1) {
							a.push([b])
							return a
						}
						a[index].push(b)
						return a
					}, [])
				}

				if (userInfo.value.status == 0) {
					// msgList.likeList = recombinArray([...newValue], (item, b) => item[0].cid === b.cid)
					msgList.likeList = recombinArray(newValue.filter(item => item.messageType === 1), (item, b) =>
						item[0].cid === b.cid)
					// msgList.voteList = recombinArray(newValue.filter(item => item.messageType === 3), (item, b) =>
					// 	item[0].did ===
					// 	b.did)
					// msgList.commentList = newValue.filter(item => item.messageType === 2)
					// msgList.dishList = recombinArray(newValue.filter(item => item.messageType === 5), (item, b) =>
					// 	item[0].matchLink ===
					// 	b.matchLink)
				} else if (userInfo.value.status == 1) {
					msgList.commentList = newValue.filter(item => item.messageType === 2)
					msgList.voteList = recombinArray(newValue.filter(item => item.messageType === 3), (item, b) =>
						item[0].did ===
						b.did)
					msgList.dishList = newValue.filter(item => item.messageType === 4)
				} else if (userInfo.value.status == 2) {
					msgList.commentList = newValue.filter(item => item.messageType === 2)
					msgList.voteList = recombinArray(newValue.filter(item => item.messageType === 3), (item, b) =>
						item[0].matchLink ===
						b.matchLink)
					msgList.dishList = recombinArray(newValue.filter(item => item.messageType === 5), (item, b) =>
						item[0].matchLink ===
						b.matchLink)
				}

			}, {
				immediate: true,
				deep: true
			})
			let msgNumList = computed(() => store.state.user.msgNumList)
			let lastIndex = 0

			function onChange(e) {
				console.log(msgNumList.value);
				store.commit('user/setMsgNumList', lastIndex)
				lastIndex = e.detail.index
			}
			onUnload(() => {
				store.commit('user/setMsgNumList', lastIndex)
			})
			return {
				userInfo,
				...toRefs(msgList),
				msgNumList,
				onChange
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mag-item {
		display: flex;
		height: 100rpx;
		padding: 10rpx;

		.left {
			width: 80rpx;
			height: 80rpx;
		}
	}

	.item {
		box-sizing: border-box;
		height: 150rpx;
		border-bottom: 1rpx solid #ddd;
		padding: 25rpx;
		display: flex;
		justify-content: space-between;
	}

	.like-list {
		.like-item {}
	}

	.left {
		position: relative;
		width: 80rpx;
	}

	.left-and-center {
		display: flex;
	}

	.center {
		padding: 0 20rpx;
	}

	.right {
		width: 95rpx;
		color: #888;
	}

	.left-img,
	.right-img,
	.center-img {
		border-radius: 50%;
		border: 4rpx solid #fff;
	}

	.left-img {
		width: 60rpx;
		height: 60rpx;
	}

	.right-img {
		position: absolute;
		left: 30%;
		top: 40%;
		width: 50rpx;
		height: 50rpx;
	}

	.center-img {
		width: 76rpx;
		height: 76rpx;
	}

	.rig-img {
		width: 95rpx;
		height: 95rpx;
		border-radius: 10rpx;
	}

	.no-border {
		border: 0px;

	}
</style>