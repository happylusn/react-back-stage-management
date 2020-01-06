
module.exports = {
  data: {
    list: [

      {
        id: 10063,
        resName: '首页',
        resKey: '/index',
        resIcon: 'homefill',
      },
      {
        id: 10064,
        resName: '流程',
        resKey: '/flow',
        resIcon: 'liucheng',
        children: [
          {
            id: 10101,
            resName: '流程列表',
            resKey: '/flow/list',
          },
          {
            id: 10102,
            resName: '新建流程',
            resKey: '/flow/new',
          }
        ]
      },
      {
        id: 10065,
        resName: '用户',
        resKey: '/user',
        resIcon: 'yonghu',
        children: [
          {
            id: 10110,
            resName: '用户列表',
            resKey: '/user/list',
          },
          {
            id: 10111,
            resName: '角色管理',
            resKey: '/user/role',
          },
          {
            id: 10110,
            resName: '权限管理',
            resKey: '/user/auth',
          }
        ]
      },
      {
        id: 10066,
        resName: '财务',
        resKey: '/finance',
        resIcon: 'caiwu',
        children: [
          {
            id: 10120,
            resName: '应收账单',
            resKey: '/finance/yszd',
          },
          {
            id: 10121,
            resName: '发票',
            resKey: '/finance/fapiao',
          },
        ]
      },
      {
        id: 10067,
        resName: '工具',
        resKey: '/tool',
        resIcon: 'gongju',
        children: [
          {
            id: 10130,
            resName: '图表',
            resKey: '/tool/echarts',
          },
          {
            id: 10131,
            resName: '编辑器',
            resKey: '/tool/editor',
          },
        ]
      },
      {
        id: 10068,
        resName: '文章',
        resKey: '/article',
        resIcon: 'zhishiku',
      },
      {
        id: 10069,
        resName: '设置',
        resKey: '/setting',
        resIcon: 'shezhi',
      }
    ],
  },
  msg: '操作成功',
  status: 1,
}
