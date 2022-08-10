import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import $ from 'jquery'
import '@/custom-component' // 注册自定义组件

import '@/assets/iconfont/iconfont.css'
import '@/styles/animate.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/reset.css'
import '@/styles/global.scss'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.prototype.$axios = axios
window.jQuery = $
window.$ = $
// axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.baseURL = 'https://stagging-api-moshu.cheangfou.com'

Vue.config.productionTip = false
Vue.filter("formatDate", originVal => {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '');
  const d = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
