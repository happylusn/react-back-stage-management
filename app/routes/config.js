import asyncComponent from '@components/async_load'

export default [
  {
    path: '/index',
    key: '/index',
    component: asyncComponent(() => import('@pages/index/example.js')),
  },
]
