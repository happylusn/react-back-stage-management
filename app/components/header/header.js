import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Menu, Dropdown, Icon, Breadcrumb, Badge } from 'antd'
import avator from '../../assets/images/avator.png'
import './header.less'

@connect((state, props) => ({
  config: state.config,
  breadcrumb: state.breadcrumb,
}))
export default class Header extends Component {
  static propTypes = {
    userStr: PropTypes.string,
    // brandName: PropTypes.string,
  };

  static defaultProps = {
    userStr: '{}',
    // brandName: '',
  };

  // 左侧菜单切换显示模式
  navMini = () => {
    this.props.leftNavMode()
  }

  handleClick = (e) => {
    console.log(e)
  }
  getDropdownMenu = () => (
    <Menu className="user-info-menu" onClick={this.handleClick}>
      <Menu.Item key="/usercenter">
        <i className="icon icon-td-yonghu1" />用户中心
      </Menu.Item>
      <Menu.Item key="2">
        <i className="icon icon-td-xiaoxi1" />消息中心<Badge count={52} overflowCount={99} />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        <Icon type="logout" />退出
      </Menu.Item>
    </Menu>
  )

  render() {
    const { breadcrumb } = this.props
    const last = breadcrumb.brcrb && breadcrumb.brcrb.length - 1
    const userInfo = JSON.parse(this.props.userStr) || {}
    const name = userInfo.chineseName
    return (
      <div className="header-bar">
        <ul className="left-nav">
          <i className="icon icon-td-caidan1" onClick={this.navMini} />
          {
            breadcrumb.brcrb && breadcrumb.brcrb.length > 0 ? (
              <Breadcrumb>
                {
                  breadcrumb.brcrb.map((item, index) => (
                    <Breadcrumb.Item key={index}>
                      {index === last ? <strong>{item}</strong> : item}
                    </Breadcrumb.Item>
                  ))
                }
              </Breadcrumb>
            ) : null
          }
        </ul>
        <ul className="right-nav">
          <li className="userinfo">
            <Dropdown overlay={this.getDropdownMenu()}>
              <div style={{ display: 'inline-block' }}>
                <img src={avator} alt={name} />
                <Badge dot>
                  <a>{name}</a>
                </Badge>
              </div>
            </Dropdown>
          </li>
          <li className="loginout">
            <a>退出</a>
          </li>
        </ul>
      </div>
    )
  }
}
