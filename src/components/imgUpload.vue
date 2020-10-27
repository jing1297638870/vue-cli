<template>
	<div class="img-upload display-flex">
		<div class="up-album-list display-flex">
			<div class="up-album-item" v-for="(x,index) in list" :key="index">
				<img :src="x" />
				<div v-on:click="delImg(index)" class="up-album-del">
					<span class="iconfont icon-chahao"></span>
				</div>
			</div>
			<div class="photo-add display-flex" v-if="!flag">
				<span class="album-add-another" v-on:click="addImage"></span>
				<input type="file" ref="evfile" @change="chooseImage" style="display:none" :multiple="multiple">
			</div>
		</div>
	</div>
</template>

<script>
	import * as qiniu from 'qiniu-js';
	export default {
		name: 'img-upload',
		props: {
			list: {
				type: Array,
				default: []
			},
			tokenHostUrl: {
				type: String,
				default: ''
			},
			qiniuNameUrl: {
				type: String,
				default: ''
			},
			multiple: {
				type: Boolean,
				default: true
			},
			maxCount: {
				type: Number,
				default: 9
			},
			qiniuKey: {
				type: String,
				default: ''
			}
		},
		data: function() {
			return {
				qiniuData: {},
				imgList: [],
			}
		},
		computed: {
			flag() {
				return this.list.length >= this.maxCount;
			}
		},
		methods: {
			delImg(i) {
				let arr = this.list;
				arr.splice(i, 1);
				this.$emit("server", arr);
			},
			addImage() {
				if(this.list.length >= this.maxCount) return Toast('最多只能上传' + this.maxCount + '张图片')
				this.$refs.evfile.click();
			},
			chooseImage(file) {
				this.imgList = [];
				this.$http.get(this.tokenHostUrl).then(res => {
					this.qiniuData = res.data.result;
					let l = file.target.files.length
					if(this.list.length + l > this.maxCount) l = this.maxCount - this.list.length;
					for(let i = 0; i < l; i++) {
						this.imgList.push(file.target.files[i]);
					}
					var length = this.imgList.length;
					this.$emit('disBtn', true);
					this.uploadImage(0, length);
				}).catch(err => console.log(err))
			},
			uploadImage(idx, len) {
				this.$http.get(this.qiniuNameUrl).then(res => {
					let file = this.imgList[idx]; //Blob 对象，上传的文件
					if(file.size / 1024 > 1025) {
						let data = new FormData();
            let that = this;
						that.photoCompress(file,{quality: 0.5},function(base64Codes){
							that.upload(that.convertBase64UrlToBlob(base64Codes), res.data.result.name, idx, len);
						})
						
					} else {
						this.upload(file, res.data.result.name, idx, len);
					}

				}).catch(err => console.log(err))
			},
			upload(file, name, idx, len) {
				let type = file.type.split('/')[1];
				let date = new Date();
				let key = this.qiniuKey + date.getFullYear() + (date.getMonth() + 1) + '/' + date.getTime() + '/' + name + '.' + type; // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

				let config = {
					useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
					region: null // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
				};
				let putExtra = {
					fname: "", //文件原文件名
					params: {}, //用来放置自定义变量
					mimeType: ["image/png", "image/jpeg", "image/jpg"] //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
				};
				let observer = { // 主要用来展示进度
					next: (result) => {
						console.log(result)
					},
					error: (errResult) => { // 失败报错信息			
						this.imgList[idx] = require('../assets/images/fail.png');
						let i = idx + 1;
						if(i < len) {
							setTimeout(() => {
								this.uploadImage(i, len);
							}, 1);
						} else {
							this.$emit('disBtn', false);
							if(this.list.length > 0) {
								this.list.forEach(item => {
									this.imgList.push(item);
								})
							}
							this.$emit("server", this.imgList);
						}
						console.log(errResult)
					},
					complete: (result) => { // 接收成功后返回的信息
						console.log(result)
						this.imgList[idx] = this.qiniuData.host + result.key;
						let i = idx + 1;
						if(i < len) {
							setTimeout(() => {
								this.uploadImage(i, len);
							}, 1);
						} else {
							this.$emit('disBtn', false);
							if(this.list.length > 0) {
								this.list.forEach(item => {
									this.imgList.push(item);
								})
							}
							this.$emit("server", this.imgList);
						}
					}
				}
				var observable = qiniu.upload(file, key, this.qiniuData.token, putExtra, config)
				var subscription = observable.subscribe(observer) // 上传开始
			},
			photoCompress(file, obj, objDiv) {
				var ready = new FileReader();
				/*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
				ready.readAsDataURL(file);
				let that = this
				ready.onload = function() {
					var re = this.result;
					that.canvasDataURL(re, obj, objDiv)
				}
			},
			canvasDataURL(path, obj, callback) {
				var img = new Image();
				img.src = path;
				img.onload = function() {
					var that = this;
					// 默认按比例压缩
					var w = that.width,
						h = that.height,
						scale = w / h;
					w = obj.width || w;
					h = obj.height || (w / scale);
					var quality = 0.7; // 默认图片质量为0.7
					//生成canvas
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');
					// 创建属性节点
					var anw = document.createAttribute("width");
					anw.nodeValue = w;
					var anh = document.createAttribute("height");
					anh.nodeValue = h;
					canvas.setAttributeNode(anw);
					canvas.setAttributeNode(anh);
					ctx.drawImage(that, 0, 0, w, h);
					// 图像质量
					if(obj.quality && obj.quality <= 1 && obj.quality > 0) {
						quality = obj.quality;
					}
					// quality值越小，所绘制出的图像越模糊
					var base64 = canvas.toDataURL('image/jpeg', quality);
					// 回调函数返回base64的值
					callback(base64);
				}
			},
			convertBase64UrlToBlob(urlData) {
				var arr = urlData.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while(n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], {
					type: mime
				});
			},
			getQiniuToken() {
				this.$http.get(this.tokenHostUrl).then(res => {
					this.qiniuData = res.data.result;
				}).catch(err => console.log(err))
			},
		},
		mounted() {

		}
	}
</script>

<style lang="scss">
	@function px2rem($px) {
		@return ($px / 20) * 1rem * 0.5;
	}
	
	.img-upload {
		background: #fff;
		padding: px2rem(20) 0 0;
		justify-content: left;
		align-items: center;
		width: 100%;
		overflow: hidden;
		.up-album-list {
			flex-wrap: wrap;
			justify-content: left;
			align-items: center;
		}
		.up-album-item {
			position: relative;
			margin-right: px2rem(20);
			margin-bottom: px2rem(20);
			height: px2rem(164);
			img {
				width: px2rem(164);
				height: px2rem(164);
			}
		}
		.up-album-del {
			background: rgba(0, 0, 0, .5);
			position: absolute;
			width: px2rem(32);
			height: px2rem(32);
			text-align: center;
			line-height: px2rem(32);
			border-radius: 50%;
			right: px2rem(-16);
			top: px2rem(-16);
			.iconfont {
				font-size: px2rem(14);
				color: #fff;
				transform: scale(.8, .8);
				display: block;
			}
		}
		.photo-add {
			justify-content: left;
			align-items: center;
			white-space: nowrap;
			color: #999;
			line-height: 3rem;
			span {
				display: inline-block;
				font-size: 2.9rem;
				height: 3rem;
				line-height: 3rem;
				margin-right: .6rem;
			}
		}
		.photo-add {
			border: 1px dashed #ccc;
			position: relative;
			display: inline-block;
			width: px2rem(164);
			height: px2rem(164);
			margin-right: .4rem;
			margin-bottom: .4rem;
			overflow: hidden;
			&:before {
				content: "";
				position: absolute;
				width: 1px;
				background-color: #ccc;
				border-radius: 1px;
				left: 50%;
				top: 0;
				bottom: 0;
				transform: scaleY(.5);
			}
			&:after {
				content: "";
				position: absolute;
				border-radius: 1px;
				height: 1px;
				background-color: #ccc;
				top: 50%;
				left: 0;
				right: 0;
				transform: scaleX(.5);
			}
			.album-add-another {
				width: px2rem(164);
				height: px2rem(164);
				display: block;
			}
		}
	}
</style>