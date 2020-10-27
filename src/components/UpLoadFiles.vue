<template>
    <div class="up-load-files">
        <div class="record-show display-flex" v-if="recordLocalId">
            <div class="record-pic">{{time}}"</div>
            <i class="iconfont icon-shanchu" @click.stop.prevent="delRecord"></i>
        </div>

        <div class="up-image-record" v-if="btnFlag">
            <i class="iconfont icon-paizhao" @click="image"></i>
            <i class="iconfont icon-luyin" v-if="record" @click="openRecord"></i>
        </div>

        <div class="album-wrapper display-flex">
            <div class="up-album-list display-flex">
                <div class="up-album-item" v-for="(x,index) in localIds" :key="index">
                    <img :src="x" />
                    <div v-on:click="delImg(index)" class="up-album-del">
                        <span class="iconfont icon-chahao"></span>
                    </div>
                </div>
                <div class="photo-add display-flex">
                    <span class="album-add-another" v-on:click="image"></span>
                </div>
            </div>
        </div>

        <mt-popup v-model="popupVisible" position="bottom" closeOnClickModal="closeOnClickModal">
            <div class="record">
                <i class="iconfont icon-luyin-" v-if="!isStartRecord" @click="startRecord"></i>
                <i class="iconfont icon-jieshu" v-if="isStartRecord" @click="stopRecord"></i>
                <div class="text" v-if="!isStartRecord">开始录音</div>
                <div class="text" v-if="isStartRecord">{{time}}"</div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
var t;
import { Toast } from 'mint-ui'
export default {
    name: 'up-load-files',
    props:{
        record:{
            type:Boolean,
            default:false
        },
        attachList:{
            type:Array
        },
        imgNum:{
        	type:Number,
          default:9
        },
        btnFlag:{
        	type:Boolean,
          default:true
        }
    },
    data() {
		return {           
            local:[], //本次上传图片的本地地址
            localIds: [],  //所有图片的本地地址
            serverIds: [], //所有图片的服务器地址

            closeOnClickModal:false,
            isStartRecord:false, //是否开始录音
            popupVisible:false, //录音图层是否显示
            time:0, //录音时间
            recordLocalId:'', //录音本地id
            recordServerId:'' //录音服务器id
        }
    },
    methods:{
        delRecord(){
            this.recordLocalId = '';
            this.recordServerId = '';
            this.isStartRecord = false;
            this.popupVisible = false;
            this.time = 0;
            this.submit();   
        },
        openRecord(){ //打开录音图层
            if(this.recordLocalId) return Toast("只能录一条");
            this.popupVisible = true;
            this.isStartRecord = false;
        },
        startRecord(){ //开始录音
            this.recordLocalId = '';
            this.recordServerId = '';           
            this.time = 0;
            this.isStartRecord = true;       
            wx.ready(() => {
                wx.startRecord();
            })
            t = setInterval(() => {
                this.time++;
                if(this.time >= 59) {
                    this.stopRecord();
                }
            }, 1000);
        },
        stopRecord(){ //结束录音            
            clearInterval(t);
            if(this.time<=0) return; 
            wx.ready(() => {
                wx.stopRecord({
                    success:(res) => {
                        this.recordLocalId = res.localId;
                        if(this.time>0) this.uploadVoice();
                    }
                });
            });
            this.popupVisible = false;
        },
        uploadVoice() { //上传语音
            this.$emit('disBtn', true);
            wx.ready(() => {
                wx.uploadVoice({
                    localId: this.recordLocalId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success:(res) => {
                        this.recordServerId = res.serverId; // 返回音频的服务器端ID
                        this.submit();                      
                    },
                    fail:(res) => {
                        this.$emit('disBtn', false);
                        console.log(JSON.stringify(res));
                    }
                });
            });
        },
        image(){
            this.local = [];
            var imgCount = this.localIds.length;
            if (imgCount >= this.imgNum) {
                Toast("最多只能上传9张图片！");
                return false;
            }
            var canImg = 9 - imgCount;
            wx.ready(() => {
                wx.chooseImage({
                //选择图片并且显示
                    count: canImg,
                    success: (res) => {
                        this.local = res.localIds;
                        this.localIds = this.localIds.concat(res.localIds);
                        this.uploadImage();
                    }
                });
            })
        },
        uploadImage() {
            //上传图片
            var length = this.local.length;
            this.$emit('disBtn', true);
            this.upload(0, length);
        },
        upload(idx, len) {
            //图片上传
            wx.ready( () => {
                wx.uploadImage({
                    localId: this.local[idx],
                    success: (res) => {
                        let i = idx+1;
                        this.serverIds.push({
                            types:'图片',
                            accessPath:res.serverId,
                            saveTypes:"微信"
                        });
                        if (i < len) {
                            setTimeout(() => {
                                this.upload(i, len);
                            },100);
                        } else {         
                            this.submit();
                        }
                    },
                    fail:(res) => {
                        this.$emit('disBtn', false);
                        console.log(JSON.stringify(res));
                    }
                });
            });
        },
        delImg(i){
            this.localIds.splice(i, 1);
            this.serverIds.splice(i, 1);
            this.submit();
        },
        submit(){
            let arr = [];
            if(this.recordServerId) {
                arr.push({
                    types:'语音',
                    accessPath:this.recordServerId,
                    saveTypes:"微信",
                    filename:this.time
                })
            }
            if(this.serverIds.length>0) {
                this.serverIds.forEach(element => {
                    arr.push(element);
                });
            }
            this.$emit('disBtn', false);
            this.$emit("server", arr);
        },
        downloadImage(imgList) { //图片下载
			if (imgList[0]) {
                this.serverIds.push({
                    types:'图片',
                    accessPath:imgList[0].accessPath,
                    saveTypes:imgList[0].saveTypes,
                });
				if (imgList[0]['saveTypes'] == "微信") {
					wx.ready(() => {
						wx.downloadImage({
							serverId: imgList[0]['accessPath'], // 需要下载的图片的服务器端ID，由uploadImage接口获得
							isShowProgressTips: 0,// 默认为1，显示进度提示
							success: (res) => {
                this.localIds.push(res.localId);
								imgList.shift();
								this.downloadImage(imgList);
							},
							fail: (err) => {
                this.localIds.push(require('../assets/images/fail.png'));
								imgList.shift();
								this.downloadImage(imgList);
							}
						});
					});
				} else {
                    this.localIds.push(imgList[0]['accessPath']);
					imgList.shift();
					this.downloadImage(imgList);
				}
			} else {
                this.submit();
            }
        }
    },
    mounted(){        
        if (this.attachList && this.attachList.length > 0) {
            var imgOldList = [];
            for (var j = 0; j < this.attachList.length; j++) {
                imgOldList.push({ "j": j, "accessPath":this.attachList[j]["accessPath"], "saveTypes": this.attachList[j]["saveTypes"] });
            }
            this.downloadImage(imgOldList);
        }        
    },
    watch:{
        popupVisible(val){
            if(!val) {
                this.stopRecord();
            }
        }
    }
}
</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.album-wrapper{
    background:#fff;
    padding:px2rem(20) 0 0; 
    justify-content: left;
    align-items: center;
    width: 100%;
    overflow: hidden;
} 
.up-album-list{
    flex-wrap: wrap;
    justify-content: left;
    align-items: center;
} 
.up-album-item{
    position: relative;
    margin-right:px2rem(20); 
    margin-bottom:px2rem(20);
    height:px2rem(164);
    img{
        width: px2rem(164);
        height: px2rem(164);
    }
}
  
  
.up-album-del{
    background:rgba(0,0,0,.5);
    position: absolute;
    width:px2rem(32);
    height:px2rem(32);
    text-align:center;
    line-height:px2rem(32);
    border-radius:50%;  
    right: px2rem(-16);
    top: px2rem(-16);
    .iconfont{
        font-size:px2rem(14);
        color:#fff;
        transform:scale(.8,.8);
        display: block;
    }
}  
  
.photo-add{
    justify-content: left;
    align-items: center;
    white-space: nowrap;
    color: #999;
    line-height: 3rem;  
    span{
        display: inline-block;
        font-size: 2.9rem;
        height: 3rem;
        line-height: 3rem;
        margin-right: .6rem;
    }
}  
.photo-add{
    border: 1px dashed #ccc;
    position: relative;
    display: inline-block;
    width: px2rem(164);
    height: px2rem(164);
    margin-right: .4rem;
    margin-bottom: .4rem;
    overflow: hidden;
    &:before{
        content: "";
        position: absolute;
        width: 1px;
        background-color: #ccc;
        border-radius:1px;
        left: 50%;
        top: 0;
        bottom: 0;
        transform: scaleY(.5);
    }
    &:after{
        content: "";
        position: absolute;
        border-radius:1px;
        height: 1px;
        background-color: #ccc;
        top: 50%;
        left: 0;
        right: 0;
        transform: scaleX(.5);
    }
    .album-add-another{
        width: px2rem(164);
        height: px2rem(164);
        display: block;
    }
}

.up-load-files{
    .mint-popup-bottom{
        right:0;
        left:0;
        transform: none;
    }
    .record{
        width:100%;
        height:px2rem(500);
        text-align: center;
        font-size:px2rem(32);
        color:#333;
        padding-top:px2rem(120);
        .iconfont{
            font-size:px2rem(200);
            color:#f00;
            line-height:1;
        }
        .icon-jieshu{
            color:#04C7FF;
        }
    }
    .record-show{       
        width: px2rem(450);
        margin:0 auto;
        height: px2rem(60);       
        line-height: px2rem(60);        
        text-align: right;
        color: #fff;
        .record-pic{
            border-radius: 900px;
            width: px2rem(450);
            background: url("../assets/images/play-btn-bg.png") no-repeat px2rem(20) center #00D634;
            background-size: 78%;
            padding-right: px2rem(20);
        }
        .record-play{
            background: url("../assets/images/play-btn-bg.gif") no-repeat px2rem(20) center #00D634;
            background-size: 78%;
        }
        .iconfont{
            margin-left:px2rem(30);
            color:#f00;
            font-size:px2rem(40);
            line-height: px2rem(60);      
        }
    }
    .up-image-record{
        padding:px2rem(20) 0;
        height:px2rem(90);
        .iconfont{
            font-size:px2rem(50);
            line-height:px2rem(50);
            margin-right:px2rem(10);
        }
        .icon-paizhao{
            color:#04C7FF;
        }
        .icon-luyin{
            color:#12CE11;
        }
    }
}
</style>
