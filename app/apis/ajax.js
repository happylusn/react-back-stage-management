import axios from 'axios'
import jsonp from 'jsonp'
import { timeout, baseURL } from '@config'
import { message } from 'antd'
import { parseQueryString } from '@util'
import NProgress from 'nprogress'
import '../../node_modules/nprogress/nprogress.css'

const { CancelToken } = axios

axios.interceptors.request.use((config) => {
  // if (config.method === 'post') {
  //   config.data = qs.stringify(config.data)
  // }
  NProgress.start()
  return config
})

axios.interceptors.response.use((config) => {
  NProgress.done()
  return config
})

// 防止连续出现多个用户登录超时的提示
let flag = true
function logOut(text) {
  if (flag) {
    message.warning(text || '用户登录过期或从其他浏览器登录')
    window.location.href = '#/login'
    flag = false
    setTimeout(() => flag = true, 0)
  }
}

let baseConfig = {
  url: '/',
  method: 'post', // default
  baseURL: '',
  // transformRequest: [
  //   function transformRequest(data) {
  //     // Do whatever you want to transform the data
  //     return data;
  //   },
  // ],
  // transformResponse: [
  //   function transformResponse(data) {
  //     // Do whatever you want to transform the data
  //     return data;
  //   },
  // ],
  headers: {
    'Content-Type': 'text/plain',
    // 'X-Requested-With': 'XMLHttpRequest',
  },
  params: {
    // ID: 12345,
  },
  data: {
    // firstName: 'Fred',
  },
  timeout: '10000', // ms

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: true, // default

  responseType: 'json', // default
  maxContentLength: 2000,

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to
  // `null` or `undefined`), the promise will be resolved; otherwise, the promise
  // will be rejected.
  validateStatus(status) {
    return status >= 200 && status < 300 // default
  },
}
baseConfig = { ...baseConfig, timeout: timeout, baseURL: baseURL }

export const oftenFetchByPost = (api, options) => {
  // 当api参数为createApi创建的返回值
  if (typeof api === 'function') return api
  /**
   * 可用参数组合：
   * (data:Object,sucess:Function,failure:Function,config:Object)
   * (data:Object,sucess:Function,config:Object)
   * (data:Object,sucess:Function)
   * (data:Object,config:Object)
   * (data:Object)
   * ()
   */
  return (...rest) => { // 参数:(data:Object,sucess?:Function,failure?:Function,config?:Object)
    // 参数分析
    const data = rest[0] || {}
    const token = sessionStorage.getItem('token')
    if (token) {
      // data.token = token
    }
    let success = null
    let failure = null
    let config = null
    for (let i = 1; i < rest.length; i += 1) {
      if (typeof rest[i] === 'function') {
        if (!success) {
          success = rest[i]
        } else {
          failure = rest[i]
        }
      }
      if (Object.prototype.toString.call(rest[i]) === '[object Object]') {
        config = rest[i]
      }
    }

    const hooks = {
      abort: null,
    }

    const cancelToken = new CancelToken((c) => { hooks.abort = c })
    // 如果是用的30上的mock的服务，那么就默认不带cookie到服务器
    if (options && (options.baseURL.indexOf('12602') !== -1)) {
      baseConfig.withCredentials = false
    } else {
      baseConfig.withCredentials = true
    }
    return new Promise((resolve, reject) => {
      axios({
        ...baseConfig, ...options, ...config, url: api, data, cancelToken,
      })
        .then(response => response.data)
        .then((response) => {
          switch (response.status) {
            case 1: { success && success(response); resolve(response); break }
            case 0: {
              // message.warning(response.msg)
              // failure && failure(response)
              if (typeof failure === 'function') {
                failure(response)
              } else {
                // eslint-disable-next-line
                if (response.msg === '系统内部错误!') {
                  message.error(response.msg)
                } else {
                  message.warning(response.msg)
                }
              }
              resolve(response)
              break
            }
            case -1: {
              if (typeof failure === 'function') {
                failure(response)
              }
              logOut(response.msg)
              break
            }
            default: {
              if (typeof failure === 'function') {
                failure(response)
                resolve(response)
              } else {
                logOut()
              }
            }
          }
        })
        .catch((e) => {
          if (axios.isCancel(e)) {
            if (process.env.NODE_ENV !== 'production') {
              console.log('Request canceled', e.message)
            }
          } else {
            console.dir(e)
            if (typeof failure === 'function') {
              let res
              if (e.code === 'ECONNABORTED') { // 超时的报错
                res = {
                  data: '',
                  msg: '服务器连接超时',
                  status: 0,
                }
              } else {
                res = {
                  data: '',
                  msg: e.message,
                  status: 0,
                }
              }
              message.error(res.msg)
              failure(res)
              resolve(res)
            }
          }
        })
    })
    // return hooks
  }
}

// 创建发起api的启动器
export const createApi = function (api, options) {
  const obj = parseQueryString(window.location.href)
  let url = api
  if (obj.key) {
    url = `${api}?key=${obj.key}`
    if (obj.sourceName) {
      url = `${api}?key=${obj.key}&sourceName=${obj.sourceName}`
    }
  }
  return oftenFetchByPost(`${url}`, options)
}

export const reqJsonp = function (options) {
  return new Promise((resolve, reject) => {
    jsonp(options.url, {
      param: 'callback',
    }, (err, response) => {
      if (response.status === 'success') {
        resolve(response);
      } else {
        reject(response.messsage);
      }
    })
  })
}
