import React from 'react'
import { withRouter } from 'react-router-dom'
import { message, LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { isLogin } from '@util'
import { brandName } from '@config'
import Header from '@components/header/header'
import LeftNav from '@components/left-nav/left-nav'

@withRouter
export default class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuStyle: false, // 左侧导航菜单是否mini模式
    }
  }
  // componentWillMount() {
  //   isLogin(this.props)
  // }
  // 组件已经加载到dom中
  componentDidMount() {
    this.init()
  }

  // 左侧是否mini
  changeMenuStyle = () => {
    const menuStyle = !this.state.menuStyle
    this.setState({
      menuStyle: menuStyle,
    }, () => {
      sessionStorage.setItem('menuStyle', menuStyle)
    })
  }

  init() {
    // antd的message组件 的全局配置
    message.config({
      duration: 3,
    })
    // 初始化左侧菜单是mini模式还是正常模式
    const menuStyle = sessionStorage.getItem('menuStyle')
    if (menuStyle === 'false') {
      this.setState({
        menuStyle: false,
      })
    }
    if (menuStyle === 'true') {
      this.setState({
        menuStyle: true,
      })
    }
  }
  render() {
    if (!isLogin(this.props)) {
      this.props.history.replace('/login')
      return null
    }
    const { menuStyle } = this.state
    const { children } = this.props
    const userStr = sessionStorage.getItem('userinfo') || '{}'
    const menuStr = sessionStorage.getItem('leftNav') || '[]'

    return (
      <LocaleProvider locale={zhCN}>
        <div className="wrapper">
          <div className="container">
            <div className={menuStyle ? 'sider-container sider-collapsed' : 'sider-container'}>
              <LeftNav
                menuStr={menuStr}
                menuStyle={menuStyle}
              />
            </div>
            <div className="content-container">
              <div className="header-content">
                <Header
                  brandName={brandName}
                  userStr={userStr}
                  leftNavMode={this.changeMenuStyle}
                />
              </div>
              <div className="page-content">
                <div className="content-wrapper" style={{ minHeight: 'calc(100vh - 110px)' }}>
                  {children}
                </div>
                <div className="footer">
                  <span>浙江七巧板信息科技股份有限公司 版权所有</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LocaleProvider>
    )
  }
}
