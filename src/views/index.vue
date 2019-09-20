<template>
<div>
  <!--开启摄像头-->
  <img @click="callCamera" :src="headImgSrc" alt="摄像头">
  <!--canvas截取流-->
  <canvas ref="canvas" width="300" height="225"></canvas>
  <!--图片展示-->
  <video ref="video" width="300" height="225" autoplay></video>
  <!--确认-->
  <button @click="photograph">拍照</button>
</div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      headImgSrc: require('@/assets/images/fail.png')
    };
  },
  methods: {
    // 调用摄像头
    callCamera () {
      if(navigator.mediaDevices.getUserMedia){
        //最新标准API
        navigator.mediaDevices.getUserMedia({video: true}).then(success => {
          // 摄像头开启成功
          this.$refs['video'].srcObject = success
          // 实时拍照效果
          this.$refs['video'].play()
        }).catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
        })
      } else if (navigator.webkitGetUserMedia){
      //webkit内核浏览器
        navigator.webkitGetUserMedia.getUserMedia({video: true}).then(success => {
          // 摄像头开启成功
          this.$refs['video'].srcObject = success
          // 实时拍照效果
          this.$refs['video'].play()
        }).catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
        })
      } else if (navigator.mozGetUserMedia){
      //Firefox浏览器
        navagator.mozGetUserMedia.getUserMedia({video: true}).then(success => {
          // 摄像头开启成功
          this.$refs['video'].srcObject = success
          // 实时拍照效果
          this.$refs['video'].play()
        }).catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
        })
      } else if (navigator.getUserMedia){
      //旧版API
        navigator.getUserMedia.getUserMedia({video: true}).then(success => {
          // 摄像头开启成功
          this.$refs['video'].srcObject = success
          // 实时拍照效果
          this.$refs['video'].play()
        }).catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
        })
      }
    },
    // 拍照
    photograph () {
      let ctx = this.$refs['canvas'].getContext('2d')
      // 把当前视频帧内容渲染到canvas上
      ctx.drawImage(this.$refs['video'], 0, 0, 320, 240)
      // 转base64格式、图片格式转换、图片质量压缩
      let imgBase64 = this.$refs['canvas'].toDataURL('image/png')
      
　　　 // 由字节转换为KB 判断大小
      
    },
    // 关闭摄像头
    closeCamera () {
      if (!this.$refs['video'].srcObject) return
      let stream = this.$refs['video'].srcObject
      let tracks = stream.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
      this.$refs['video'].srcObject = null
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
@function px2rem($px) {
  @return ($px / 20) * 1rem * 0.5;
}
</style>
