<template>
	<div class="picList">
		<img v-on:click="bigImg(x.accessPath)" v-for="(x,index) in imgList" :key="index" class="img" :src="x.accessPath" alt="" />
	</div>
</template>

<script>
	export default {
		name: 'base-files',
		props: {
			imgArr: {
				type: Array,
				defaule: []
			},
			index: {
				type: Number,
				defaule: 0
			},
			isBig: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				imgList: []
			}
		},
		methods: {
			downloadImage(imgList) { //图片下载
				if(imgList[0]) {
					if(imgList[0]['saveTypes'] == "微信") {
						wx.ready(() => {
							wx.downloadImage({
								serverId: imgList[0]['accessPath'], // 需要下载的图片的服务器端ID，由uploadImage接口获得
								isShowProgressTips: 0, // 默认为1，显示进度提示
								success: (res) => {
									this.imgList[imgList[0]["j"]]["accessPath"] = res.localId;
									this.imgList[imgList[0]["j"]]["saveTypes"] = '已下载';
									imgList.shift();
									this.downloadImage(imgList);
								},
								fail: () => {
									this.imgList[imgList[0]["j"]]["accessPath"] = require('../assets/images/fail.png');
									this.imgList[imgList[0]["j"]]["saveTypes"] = '下载失败';
									imgList.shift();
									this.downloadImage(imgList);
								}
							});
						});
					} else {
						this.imgList[imgList[0]["j"]]["accessPath"] = imgList[0]['accessPath'];
						imgList.shift();
						this.downloadImage(imgList);
					}
				} else {
					this.$emit("downListIndex", this.index);
					this.$emit("backArr", {index:this.index, arr:this.imgList});
				}
			},
			bigImg(src) { //点击查看大图
				if(!this.isBig) return
				var imgg = src;
				var imgs = [];
				for(var j = 0; j < this.imgList.length; j++) {
					imgs.push(this.imgList[j].accessPath);
				}
				wx.ready(() => {
					wx.previewImage({
						current: imgg, // 当前显示图片的http链接
						urls: imgs // 需要预览的图片http链接列表
					});
				})
			}
		},
		mounted() {
			this.imgList = this.imgArr;
			var imgOldList = [];
			if(this.imgArr) {
				for(var j = 0; j < this.imgArr.length; j++) {
					imgOldList.push({
						"j": j,
						"accessPath": this.imgArr[j]["accessPath"],
						"saveTypes": this.imgArr[j]["saveTypes"]
					});
				}
			}
			this.downloadImage(imgOldList);
		}			
	}
</script>
<style lang="scss">
	@function px2rem($px) {
		@return ($px / 20) * 1rem * 0.5;
	}
</style>