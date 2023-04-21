//获取传入时间戳距现在还剩的天、时、分、秒(用于倒计时)
export const countDown=(time)=>{
	if(time<Date.now()){
		return {isOverTime:true}
	}
	let day=Math.floor((time-Date.now())/86400000)
	let hour=Math.floor((time-Date.now())%86400000/3600000)
	let min=Math.floor((time-Date.now())%3600000/60000)
	let sec=Math.floor((time-Date.now())%60000/1000)
	return {day,hour,min,sec,isOverTime:false}
}
//获取传入时间戳距现在还剩的天、时、分(用于显示评论发布时间)
export const releaseTime=(time)=>{
	let seconds=Math.floor((Date.now()-time)/1000) //获取传入时间距现在秒数
	if(seconds<0){
		return null
	}
	if(seconds>=0&&seconds<60){
		let result=Math.floor(seconds)
		return result+'秒前'
	}
	if(seconds>=60&&seconds<3600){
		let result=Math.floor(seconds/60)
		return result+'分前'
	}
	if(seconds>=3600&&seconds<86400){
		let result=Math.floor(seconds/3600)
		return result+'小时前'
	}
	if(seconds>=86400&&seconds<86400*7){
		let result=Math.floor(seconds/86400)
		return result+'天前'
	}
	if(seconds>=86400*7&&seconds<86400*365){
		const date = new Date(time)
		const M = date.getMonth() + 1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1
		const D = date.getDate()
		return `${M}-${D}`
	}
	if(seconds>=86400*365){
		const date = new Date(time)
		const Y=date.getFullYear()
		const M = date.getMonth() + 1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1
		const D = date.getDate()< 10 ? '0'+date.getDate() : date.getDate()
		return `${Y}-${M}-${D}`
	}
}

