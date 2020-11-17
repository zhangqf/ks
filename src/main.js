import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import 'video.js/dist/video-js.css'
import VideoPlayer from 'vue-video-player'
import JsonExcel from 'vue-json-excel'

import App from './App'
import store from './store'
import router from './router'

import 'video.js/dist/video-js.css'
import '@/icons' // icon
import '@/permission' // permission control
Vue.use(VideoPlayer)
Vue.component('downloadExcel', JsonExcel)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
  console.log = function() {}
  console.error = function() {}
  console.warn = function() {}
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
