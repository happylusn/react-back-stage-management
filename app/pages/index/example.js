import React, { Component } from 'react'
import { Card, Icon, Row, Col } from 'antd'
import { reqJsonp } from '@apis/ajax'
import moment from 'moment'
import { getGreeting, getWeatherClass } from '@util'

import '@styles/index.less'
import '@styles/weather.css'
import avator from '../../assets/images/avator.png'

export default class app extends Component {
  static defaultProps={
  }

  static propTypes = {
  }

  constructor(props) {
    super(props)
    this.state = {
      hour: '',
      greeting: '',
      dayWeatherClass: '',
      nightWeatherClass: '',
      city: '杭州',
      weather: '晴天',
      temperature: '',
    }
    this.interval = 0
  }

  componentWillMount() {
    let hour = moment().format('HH')
    this.setState({
      hour,
      greeting: getGreeting(hour),
    })

    this.interval = setInterval(() => {
      hour = moment().format('HH')
      this.setState({
        hour,
        greeting: getGreeting(hour),
      })
    }, 1000)
    this.getWeatherAPIData()
  }

  componentWillUnmount() {
    console.log(1111, this.interval)
    clearInterval(this.interval)
  }

  getWeatherAPIData() {
    const city = encodeURIComponent('杭州');
    reqJsonp({
      url: `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
    }).then((res) => {
      if (res.status === 'success') {
        const data = res.results[0].weather_data[0];
        const dayWeatherClass = getWeatherClass(data.dayPictureUrl)
        const nightWeatherClass = getWeatherClass(data.nightPictureUrl, 'night')
        const { temperature, weather } = data
        this.setState({
          dayWeatherClass,
          nightWeatherClass,
          temperature,
          weather,
        })
      }
    })
  }

  render() {
    const { hour, dayWeatherClass, nightWeatherClass } = this.state
    let weatherClass
    if (hour >= '06' && hour < '18') {
      weatherClass = dayWeatherClass
    } else {
      weatherClass = nightWeatherClass
    }
    return (
      <div>
        <div className="solicitude">
          <div className="avatar">
            <img src={avator} alt="头像" />
          </div>
          <div className="content">
            <div className="greeting">{this.state.greeting}，鲁俊。</div>
            <div className="tip">放松心情，开心工作</div>
          </div>
          <div className="weather">
            <div className={weatherClass} />
            <div className="desc">
              <div className="city">{this.state.city}</div>
              <div className="tianqi">{this.state.weather}</div>
              <div className="wendu">{this.state.temperature}</div>
            </div>
          </div>
        </div>
        <div className="quick-link-list">
          <Card className="quick-ant-card bg-1">
            <a href="#"><span>原始订单</span><Icon type="arrow-right" /></a>
          </Card>
          <Card className="quick-ant-card bg-2">
            <a href="#">OMS订单<Icon type="arrow-right" /></a>
          </Card>
          <Card className="quick-ant-card bg-3">
            <a href="#">退换货列表<Icon type="arrow-right" /></a>
          </Card>
          <Card className="quick-ant-card bg-4">
            <a href="#">批量审单<Icon type="arrow-right" /></a>
          </Card>
          <Card className="quick-link-add">
            <a href="#">
              <p><Icon type="plus" /></p>
              <p>自定义</p>
              <p>快捷操作</p>
            </a>
          </Card>
        </div>
        <div className="notice-list-row">
          <Row>
            <Col
              className="notice-col"
              lg={{ span: 12 }}
              md={{ span: 12 }}
              xs={{ span: 24 }}
            >
              <Card
                title={<span><i className="icon icon-td-tixing" />系统通知</span>} extra={<a href="#">More</a>}
              >
                <ul className="list-group">
                  <li className="list-group-item">
                    <a>
                      <small>2019-05-20 13:14:34</small>
                      <i className="icon icon-td-huo" />
                      先款后货订单确认、公司资质文件申请、赊销订单确认流程上线通知
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a>
                      <small>2019-05-20 13:14:34</small>
                      支付宝实名认证申请上线通知
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a>
                      <small>2019-05-20 13:14:34</small>
                      日常预打包审核流程、预售先进系统、套餐明细修改 、大促预估调整上线通知
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a>
                      <small>2019-05-20 13:14:34</small>
                      柴火分工钉钉版上线
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a>
                      <small>2019-05-20 13:14:34</small>
                      大型报表申请入口自年前迁移到OC系统
                    </a>
                  </li>
                </ul>
              </Card>
            </Col>
            <Col
              className="notice-col"
              lg={{ span: 12 }}
              md={{ span: 12 }}
              xs={{ span: 24 }}
            >
              <Card
                title={<span><i className="icon icon-td-tixing" />系统通知</span>} extra={<a href="#">More</a>}
              >
                <ul className="list-group">
                  <li className="list-group-item">
                    <a>
                      <small>2019-05-20 13:14:34</small>
                      <i className="icon icon-td-huo" />
                      先款后货订单确认、公司资质文件申请、赊销订单确认流程上线通知
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a>
                      <small>2019-05-20 13:14:34</small>
                      <i className="icon icon-td-huo" />
                      支付宝实名认证申请上线通知
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a>
                      <small>2019-05-20 13:14:34</small>
                      日常预打包审核流程、预售先进系统、套餐明细修改 、大促预估调整上线通知
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a>
                      <small>2019-05-20 13:14:34</small>
                      柴火分工钉钉版上线
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a>
                      <small>2019-05-20 13:14:34</small>
                      大型报表申请入口自年前迁移到OC系统
                    </a>
                  </li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
