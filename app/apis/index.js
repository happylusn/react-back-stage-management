import { mockURL, /* baseURL, */ path } from '@config'
import { createApi } from './ajax'

const option = { baseURL: mockURL }

export const login = createApi(`${path}/usercenter/login`, option) // 登陆
export const logout = createApi(`${path}/usercenter/logout`, option) // 登出
export const loginByTicket = createApi(`${path}/usercenter/loginByTicket`, option) // 通过ticket登陆
export const loginByKey = createApi(`${path}/service/pagerservice/checkKey`, option) // 通过key进入项目
export const staff = createApi(`${path}/usercenter/user/userInfo`, option) // 用户信息
export const synUser = createApi(`${path}/usercenter/user/synUser`, option)// 同步用户
export const menu = createApi(`${path}/usercenter/user/userMenu`, option) // 获取菜单
