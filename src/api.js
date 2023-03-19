import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/util'
let isH = localStorage.getItem("_hhh")
let subPath = isH?'/novels_h':'/novels_n'
const allApi = {
    test:"/novels_n/test",// 测试用例
    registerUser: "/user/registerUser", // 注册用户
    getUserInfoByName: "/user/getUserInfoByName", // 根据用户名和密码获取用户信息
    getUserInfoById: "/user/getUserInfoById", // 根据用户id获取用户信息
    updateBookShell: "/user/updateBookShell", //加入书架或从书架移除
    getReadRecords: "/user/getReadRecords", // 根据用户id查询阅读记录
    setReadRecord: "/user/setReadRecord", // 插入阅读记录

    getLastNovels: `${subPath}/getLastNovels`, //获取昨天更新的数据
    getNovelsByKeyword: `${subPath}/getNovelsByKeyword`, //根据搜索关键词获取列表
    getNovelsById: `${subPath}/getNovelsById`, //获取昨天更新的数据
}
/**
 * 请求方法封装
 * @param {String} url 请求url
 * @param {Object} params 请求参数
 * @param {String} method 请求模式
 * @param {Object} headers 请求头
 * @param {Boolean} fullRes 返回模式，如果fullRes为true则返回所有报文，如果为false返回报文的data数据
 * @param {Number} timeout 该接口超时响应时间
 * @returns 返回数据
 */
export async function fetchData (url, params = {}, method = 'post', headers = {}, fullRes = false, timeout = null) {
    const urlStr = allApi[url].split('/:')
    let strUrl = urlStr[0]
    if (urlStr.length > 1) {
      for (let i = 1; i < urlStr.length; i++) {
        const route = urlStr[i].split('/')
        route[0] = typeof params === 'string' ? praseStrEmpty(params) : params[route[0]]
        strUrl = strUrl + '/' + route.join('/')
        if (typeof params !== 'string') {
          delete params[urlStr[i].split('/')[0]]
        }
      }
    }
    const query = {
      url: strUrl,
      method: method.toLowerCase()
    }
    if (urlStr.length === 1 || typeof params !== 'string') {
      if (method === 'get' || method === 'delete') {
        query.params = params
      } else {
        query.data = params
      }
    } else {
      query.data = params
    }
    // 请求添加请求头
    if (Object.keys(headers).length > 0) {
      query.headers = headers
    }
    // 设置接口超时时间
    if (timeout && !isNaN(Number(timeout))) {
      query.timeout = Number(timeout)
    }
    const res = await request(query)
    return fullRes ? res : res.data
  }