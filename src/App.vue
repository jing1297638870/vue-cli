<template>
  <div id="app" :class="ios6 ? 'ios6' : ''">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <transition name="slide-fade">
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition> 
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return { 
        ios6:false
      }
    },
    computed: {
      
    },
    mounted(){
      //判断苹果手机型号 iPhone 6 是 Apple A8 GPU
      var canvas = document.createElement('canvas'),
      gl = canvas.getContext('experimental-webgl'),
      debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      let gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      if(gpu.indexOf('Apple')!=-1 && gpu.indexOf('A8')!=-1) this.ios6 = true;
    }
  }
</script>
