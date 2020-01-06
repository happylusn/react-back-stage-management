import React, { Component } from 'react'
import { Menu, Spin } from 'antd'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { clearGformCache2, setBreadcrumb } from '@actions/common'

import './left-nav.less'

const { SubMenu } = Menu

@connect((state, props) => ({
  config: state.config,
}))
@withRouter
export default class LeftNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // menuStyle: false,
      openKeys: [],
    }
  }
  static propTypes = {
    menuStr: PropTypes.string,
    menuStyle: PropTypes.bool,
  }
  static defaultProps = {
    menuStr: '[]',
    menuStyle: false,
  }
  componentWillMount() {
    this.props.dispatch(setBreadcrumb(this.getBreadcrumb(this.props.location.pathname)))
  }
  componentDidMount() {
    this.init()
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.menuStyle) {
      this.setState({
        openKeys: [],
      })
    } else {
      this.openKeys(nextProps.location.pathname, nextProps.menuStyle)
    }
  }

  init = () => {
    this.openKeys(this.props.location.pathname, this.props.menuStyle)
  }

  openKeys = (pathname, menuStyle) => {
    const menu = JSON.parse(this.props.menuStr)
    if (pathname === '/index') {
      this.setState({
        openKeys: ['sub0'],
      })
      return
    }
    if (menuStyle) {
      this.setState({
        openKeys: [],
      })
      return
    }
    let key = 0
    let flag = false
    for (let i = 0; i < menu.length; i++) {
      const item = menu[i]
      if (item.resKey && item.resKey === pathname) {
        key = i
        break
      } else if (item.children && item.children.length > 0) {
        for (let j = 0; j < item.children.length; j++) {
          const record = item.children[j]
          if (record.resKey && record.resKey === pathname) {
            flag = true
            key = i
            break
          }
        }
      }
      if (flag === true) {
        break
      }
    }
    this.setState({
      openKeys: [`sub${key}`],
    })
  }

  // 左侧菜单切换显示模式
  navMini = () => {
    const menuStyle = !this.props.menuStyle
    this.props.leftNavMode(menuStyle)
  }

  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    this.setState({
      openKeys: latestOpenKey ? [latestOpenKey] : [],
    })
  }

  getBreadcrumb = (pathname) => {
    const menu = JSON.parse(this.props.menuStr)
    if (pathname === '/index') {
      return ['首页', '公告']
    }
    const res = []
    let flag = false
    for (let i = 0; i < menu.length; i++) {
      const item = menu[i]
      if (item.resKey && item.resKey === pathname) {
        res.push(item.resName)
        break
      } else if (item.children && item.children.length > 0) {
        for (let j = 0; j < item.children.length; j++) {
          const record = item.children[j]
          if (record.resKey && record.resKey === pathname) {
            flag = true
            res.push(item.resName)
            res.push(record.resName)
            break
          }
        }
      }
      if (flag === true) {
        break
      }
    }
    return res
  }

  // 菜单点击事件
  _handleClick = (e) => {
    this.props.dispatch(clearGformCache2({}))
    this.props.dispatch(setBreadcrumb(this.getBreadcrumb(e.key)))
    this.props.history.push(e.key)
  }
  // 左侧菜单高亮的控制
  leftMenuHighLight = () => {
    const { pathname } = this.props.location
    if (pathname === '/index') {
      return []
    }
    return [pathname]
  }

  // 二级菜单的生成
  renderLeftNav = () => {
    const menu = JSON.parse(this.props.menuStr)
    return menu.map((item, index) => {
      if (!item.children || item.children.length === 0) {
        return (
          <Menu.Item key={item.resKey ? item.resKey : item.id} name={item.resName} style={{ paddingLeft: 0 }}>
            <i className={`icon icon-td-${item.resIcon}`} title={item.resName} />
            <span className="menu-name">{item.resName}</span>
          </Menu.Item>
        )
      }
      const key = `sub${index}`
      return (
        <SubMenu key={key}
          title={
            <span>
              <i className={`icon icon-td-${item.resIcon}`} title={item.resName} />
              <span className="menu-name">{item.resName}</span>
            </span>
          }
        >
          {
            item.children.map((child, _index) =>
              (
                <Menu.Item key={child.resKey ? child.resKey : child.id} name={child.resName}>
                  <span className="menu-name">{child.resName}</span>
                </Menu.Item>
              ))
          }
        </SubMenu>
      )
    })
  }

  render() {
    const { openKeys } = this.state
    const { menuStyle } = this.props
    return (
      <div className="sider-children">
        <NavLink className="logo" to="/index">
          <i className={menuStyle ? 'brand min-mode' : 'brand'} />
        </NavLink>
        <div className="sider-mian" style={{ height: 'calc(100vh - 60px)' }}>
          <Spin spinning={false}>
            <Menu
              onClick={this._handleClick}
              openKeys={openKeys}
              mode="inline"
              theme="dark"
              inlineCollapsed={menuStyle}
              onOpenChange={this.onOpenChange}
              selectedKeys={this.leftMenuHighLight()}
            >
              {this.renderLeftNav()}
            </Menu>
          </Spin>
        </div>
      </div>
    )
  }
}
