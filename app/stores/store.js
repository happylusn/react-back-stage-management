import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '@reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

export default function configure(initialState = {}) {
  const enhancers = process.env.NODE_ENV === 'development' ? composeWithDevTools(applyMiddleware(thunkMiddleware)) : applyMiddleware(thunkMiddleware)

  const store = createStore(rootReducer, initialState, enhancers)

  return store
}
