<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "/wxcomponents/dist/common/index.wxss";

	page {
		font-size: 3.6vw;
		background-color: #f5f5f5;
	}

	iamge {
		width: 100%;
		height: 100%;
	}

	
</style>
