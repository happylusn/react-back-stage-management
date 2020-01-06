import { handleActions } from 'redux-actions'

// 登陆返回结果
const loginState = () => ({ loading: false })
export const loginResponse = handleActions({
  'request login'(state, action) {
    return { ...state, loading: true }
  },
  'receive login'(state, action) {
    // eslint-disable-next-line no-unused-vars
    const { req, res } = action.payload
    return { data: res, loading: false }
  },
}, loginState())


// gForm2.0缓存
const cache2 = () => ({})
export const gFormCache2 = handleActions({
  'set gform cache2'(state, action) {
    const { cacheKey, cacheContent } = action.payload
    if (cacheKey === undefined) {
      throw new Error('cacheKey不能是undefined')
    }
    if (cacheContent === undefined) {
      throw new Error('cacheContent不能是undefined')
    }
    state[cacheKey] = { ...state[cacheKey], ...cacheContent }
    return { ...state }
  },
  'clear gform cache2'(state, action) {
    return cache2()
  },
}, cache2())

const breadcrumbState = () => ({ brcrb: ['首页', '公告'] })
export const breadcrumb = handleActions({
  'set breadcrumb'(state, action) {
    return {
      ...state,
      brcrb: action.payload,
    }
  },
}, breadcrumbState())
