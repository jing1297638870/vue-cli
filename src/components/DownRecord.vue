<template>
    <div class="down-record display-flex">
        <div class="record-pic" :class="play?'record-play':''" @click="playVoice">{{time}}"</div>
        <audio id="music" :src="localId"></audio> 
    </div>
</template>

<script>
let t;
export default {
    name: 'down-record',
    props:{
        record:{
            type:Object
        } 
    },
    data() {
		return {
            localId:'',
            play:false,
            time:0
        }
    },
    methods:{
        playVoice() { 
            if(this.record.saveTypes == '微信') return this.wxVioce();  
            this.qiniuVioce();                   
        },
        qiniuVioce(){
            if(this.play) return;
            let audio = document.getElementById('music'); 
            this.play = true;
            audio.play();// 播放
            t = setInterval(() => {
                this.time--;
                if(this.time<=0) {
                    audio.pause();// 停止
                    clearInterval(t);
                    this.play = false;
                    this.time = Number(this.record.filename);
                }
            }, 1000);
        },
        wxVioce(){
            wx.ready(() => {    
                if(this.play) return;           
                if(!this.localId) return Toast('语音下载失败');
                this.play = true;
                wx.playVoice({ //播放语音
                    localId: this.localId // 需要播放的音频的本地ID，由stopRecord接口获得
                });
                this.time--;
                t = setInterval(() => {
                    this.time--;
                    if(this.time<=0) {
                        wx.stopVoice({ //停止播放
                            localId: this.localId // 需要停止的音频的本地ID，由stopRecord接口获得
                        });
                        clearInterval(t);
                        this.play = false;
                        this.time = Number(this.record.filename);
                    }
                }, 1000);
            });
        }		
    },
    mounted(){
        this.time = Number(this.record.filename);
        if(this.record.saveTypes != '微信') return this.localId = this.record.accessPath;
        
        wx.ready(() => {
            wx.downloadVoice({
                serverId: this.record.accessPath, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: (res) => {
                    this.localId = res.localId; // 返回音频的本地ID
                }
            });
        })
    }
}
</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.down-record{
    width: px2rem(450);
    margin:px2rem(20) auto;
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
}
</style>
