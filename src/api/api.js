import Vue from 'vue'
import axios from 'axios';
// import qs from 'qs';
import {Message} from 'element-ui';
import {Dialog, unique} from "../api/util.js"
import VueRouter from 'vue-router'
// Vue.use(VueRouter)


// axios 配置
// axios.defaults.timeout = 5000
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.baseURL = 'http://192.168.110.92:9527/ccloud/'; //本地环境
axios.defaults.baseURL = 'http://112.74.31.201:9527/ccloud/'; //测试环境
// axios.defaults.baseURL = 'http://47.52.252.202:8085/'; //正式环境
// axios.defaults.baseURL = 'http://forestfile.jindingaus.com:8085/'; //正式环境域名
// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = JSON.stringify(config.data)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
// 返回状态判断
axios.interceptors.response.use((res) => {
  if (res.status === 200) {
    return res
  } else {
    return Promise.reject(res)
  }
}, (err) => {
  if (err.response == 500) {
    Dialog.message('抱歉，服务器出错了！', 'error', 3000)
    window.location.href = '/500'
  } else if(err.response == 404) {
    Dialog.message('抱歉，您访问的页面不存在！', 'error', 3000)
    window.location.href = '/404_t'
  } else {
    Dialog.message('抱歉，访问出错了！', 'error', 3000)
  }
  return Promise.reject(err)
})

Vue.filter('tofix2',(value)=>{
   return value.toFixed(2)
})
// 封装调用的接口 getData
export function getData(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        if (res.data.code == 1002) {
          Dialog.message('登录失效,请重新登录！', 'error', 3000)
          setTimeout(() => {
            window.location.href = './'
          }, 2000);
        } else {
          resolve(res.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
