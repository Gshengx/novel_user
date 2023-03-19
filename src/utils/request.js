import axios from 'axios'
import { VueAxios } from './axios'

// 创建 axios 实例
const request = axios.create({
    // API 请求的默认前缀
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 1000 * 60 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = error => {
    console.log('err:', error)
    // location.href = `/login`
    return Promise.reject(error)
  }
  
  // request interceptor
  request.interceptors.request.use(config => {
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?'
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName]
        var part = encodeURIComponent(propName) + '='
        if (value && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              const params = propName + '[' + key + ']'
              var subPart = encodeURIComponent(params) + '='
              url += subPart + encodeURIComponent(value[key]) + '&'
            }
          } else {
            url += part + encodeURIComponent(value) + '&'
          }
        }
      }
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    return config
  }, errorHandler)
  
  // response interceptor
  request.interceptors.response.use(res => {  
    return res.data
  }, errorHandler)
  
  const installer = {
    vm: {},
    install(Vue) {
      Vue.use(VueAxios, request)
    }
  }
  
  export default request
  
  export { installer as VueAxios, request as axios }