// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import axios from 'axios'
import util from './assets/js/util'
import Vuex from 'vuex'

import 'mint-ui/lib/style.css'
import './assets/scss/yx-skin-base.scss'
import './assets/scss/yx-iconfont.css'
import './assets/scss/common.scss'
import * as filter from './assets/js/filter.js'
import * as directive from './assets/js/directive.js'

import Copyright from './components/Copyright.vue'
import Reminder from './components/Reminder.vue'
import MessageBox from './components/MessageBox.vue'

Vue.use(MintUI)
Vue.use(Vuex)
Vue.use(ElementUI);

Vue.component('Copyright', Copyright);
Vue.component('Reminder', Reminder);
Vue.component('MessageBox', MessageBox);

Object.keys(filter.default).forEach(key => {
  Vue.filter(key, filter.default[key])
})

Object.keys(directive.default).forEach(key => {
  Vue.directive(key, directive.default[key])
})

const store = new Vuex.Store({
  state: {
    
  },
  mutations: {
    
  },
  actions: {
    
  }
});

//加载全局使用的函数
Vue.prototype.util = util;


Vue.config.productionTip = false

//加载 axios
Vue.prototype.$http = axios

//组件之间传递变量使用
window.eventBus = new Vue();

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})


