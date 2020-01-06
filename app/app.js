import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import Login from '@pages/login/login_v1'

import '@styles/base.less'
import '@styles/iconfont.css'

import Admin from './Admin'
import Routes from './routes'

export default class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={() => (
            <Admin>
              <Routes />
            </Admin>
          )}
          />
        </Switch>
      </HashRouter>
    )
  }
}
