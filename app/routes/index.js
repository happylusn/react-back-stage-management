import React from 'react'
import { Route, Switch } from 'react-router-dom'
import routes from './config';


export default () => (
  <Switch>
    {
      routes.map(item => (
        <Route key={item.key} path={item.path} component={item.component} />
      ))
    }
  </Switch>
)
