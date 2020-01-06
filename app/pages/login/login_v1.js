import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin, Form, Icon, Input, Button, Tabs, Alert } from 'antd'
import { regExpConfig } from '@util'
import QueuiAnim from 'rc-queue-anim'
import { clearGformCache2, login } from '@actions/common'
import { menu, staff } from '@apis'

import '@styles/login_v1.less'

const TabPane = Tabs.TabPane
const FormItem = Form.Item

@connect((state, props) => ({
  config: state.config,
  loginResponse: state.loginResponse,
}))
@Form.create({
  onFieldsChange(props, items) {},
})
export default class Login extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state = {
      // loading: false,
      show: true,
    }
  }
  refesh = () => {
    this.refs.qr.src = `http://localhost:1234/qrcode?t=${Math.random()}`
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const query = this.props.form.getFieldsValue()
        // this.setState({ loading: true })
        const result = await this.props.dispatch(login(values))
        if (result.status === 1) {
          sessionStorage.setItem('token', result.data.token)
          sessionStorage.setItem('ticket', result.data.ticket)
          const menus = await menu({})
          if (menus.status === 1 && menus.data.list) {
            sessionStorage.setItem('leftNav', JSON.stringify(menus.data.list))
          }
          const userinfo = await staff({ usercode: query.username })
          if (userinfo.status === 1) {
            sessionStorage.setItem('userinfo', JSON.stringify(userinfo.data))
            this.props.history.push('/index')
          }
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login">
        <div className="login-con">
          <Tabs defaultActiveKey="1">
            <TabPane tab="微信扫码登录" key="1">
              <div className="wx-qr-code-img">
                <img ref="qr" id="qr_code" src={`http://localhost:1234/qrcode?t=${Math.random()}`} />
              </div>
              <div className="wx-tip">
                <span>请使用手机扫描二维码登录</span>
                <a href="javascript:;" onClick={this.refesh}><Icon type="reload" />刷新</a>
              </div>
            </TabPane>
            <TabPane tab="账号密码登录" key="2">
              <Spin spinning={this.props.loginResponse.loading}>
                <Form onSubmit={e => this.handleSubmit(e)}>
                  <div>
                    <Alert message="扫码登录更安全" type="warning" showIcon />
                    <FormItem hasFeedback>
                      {getFieldDecorator('username', {
                        rules: [
                          {
                            required: true, min: 4, max: 10, message: '用户名为4-10个字符',
                          },
                          { pattern: regExpConfig.policeNo, message: '账号4-10位数字或字母组成' },
                        ],
                      })(<Input addonBefore={<Icon type="user" />} placeholder="请输入用户名" type="text" />)}
                    </FormItem>
                    <FormItem hasFeedback>
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            required: true, min: 6, max: 16, message: '密码为6-16个字符',
                          },
                          { pattern: regExpConfig.pwd, message: '密码由6-16位数字或者字母组成' },
                        ],
                      })(<Input addonBefore={<Icon type="lock" />} placeholder="请输入密码" type="password" />)}
                    </FormItem>
                    <FormItem>
                      <Button type="primary" htmlType="submit" className="cert-btn">登录</Button>
                    </FormItem>
                  </div>
                </Form>
              </Spin>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
