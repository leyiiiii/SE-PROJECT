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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
