import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin, Form, Icon, Input, Button, Row, Col, message } from 'antd'
import { brandName } from '@config'
import { regExpConfig } from '@util'
import QueuiAnim from 'rc-queue-anim'
import Logo from '@components/logo/logo'
import { clearGformCache2, login } from '@actions/common'
import { menu, staff } from '@apis'

import '@styles/login.less'

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
      isCertificates: false,
      show: true,
    }
  }

  componentWillMount() {
    this.props.dispatch(clearGformCache2({}))
  }

  handleSubmit = async (e, isCertificates) => {
    e.preventDefault()
    if (isCertificates) {
      message.warning('证书登录功能未开通')
      return false
    }
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
    return true
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-container">
        <div className="extraLink" />
        <div className="flexcolumn">
          <div className="login-header" key="header">
            <div className="slogan">
              <QueuiAnim className="flexcolumn" type={['right', 'left']} key="p">
                {
                  this.state.show ? [
                    <p key="0" className="title">{brandName}
                      {/* <span className="en">BIG DATA</span> */}
                    </p>,
                  ] : null
                }
              </QueuiAnim>
            </div>
            <Logo />
          </div>
          <div className="login-main">
            <QueuiAnim delay={300} type="bottom" key="row">
              {
                this.state.show ? [
                  <Row key={1}>
                    <Col span={8} />
                    <Col span={8}>
                      <Spin spinning={this.props.loginResponse.loading}>
                        <Form onSubmit={e => this.handleSubmit(e, this.state.isCertificates)}>
                          {!this.state.isCertificates ?
                            (<div>
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
                            </div>) :
                            <FormItem>
                              <Button type="primary" htmlType="submit">证书登录</Button>
                            </FormItem>
                          }
                        </Form>
                      </Spin>
                    </Col>
                    <Col span={8} />
                  </Row>,
                ] : null
              }
            </QueuiAnim>
          </div>
          <QueuiAnim component="div" className="login-footer" delay={600} type="bottom" key="footer">
            {
              this.state.show ? [
                <p key="0"> 浙江七巧板信息科技股份有限公司 </p>,
              ] : null
            }

          </QueuiAnim>
        </div>
      </div>
    )
  }
}
