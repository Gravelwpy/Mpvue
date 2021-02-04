import Vue from 'vue'
import App from './App'
import global from './api/global'

Vue.prototype.GLOBAL = global
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
