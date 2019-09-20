import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import { Indicator } from "mint-ui"

Vue.use(Router)

// const PREFIX = '/alipayv';
const PREFIX = '';

const router = new Router({

  mode: 'hash',
  //mode: 'history',
  routes: [
    {
      path: PREFIX + '/index', 
      name: 'index',
      component: () => import('@/views/index')
    },
    {
      path: PREFIX + '/photo', 
      name: 'photo',
      component: () => import('@/views/photo')
    },
  ]
});


router.afterEach((to, from, next) => {
  setTimeout(function() {
    document.documentElement.scrollTop=1;
    document.body.scrollTop=1;
  }, 1); 
  //判断是否为着陆页
  if (navigator.userAgent.toLowerCase().indexOf('iphone') !== -1 && !sessionStorage.getItem('landingUrl')) {
    sessionStorage.setItem('landingUrl', window.location.href);
  }

});

export default router;

//axios拦截
axios.interceptors.request.use(function(config) {
  Indicator.open(); 
  return config;
});
axios.interceptors.response.use(function(response) {
  Indicator.close();
  return response;
})
