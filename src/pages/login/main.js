import Vue from 'vue'
import App from './index'

// add this to handle exception
Vue.config.errorHandler = function (err) {
  if (console && console.error) {
    console.error(err)
  }
}

//生成应用的实例
const app = new Vue(App)
//挂载整个应用
app.$mount()
