import { combineReducers } from 'redux'

import * as common from './common'


export default combineReducers({
  config: (state = {}) => state,
  ...common,
})
