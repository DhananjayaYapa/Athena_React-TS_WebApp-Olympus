/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Middleware, type Dispatch, type Action } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'
import rootSaga from '../sagas'

import { configureStore } from '@reduxjs/toolkit'

const logger: Middleware = createLogger() as Middleware<object, any, Dispatch<Action>>
const sagaMiddleware = createSagaMiddleware()

const process_env = import.meta.env.VITE_APP_ENV

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: any) => {
    const middleware = getDefaultMiddleware()
    if (process_env === 'dev' || process_env === 'local') {
      middleware.push(logger)
    }

    middleware.push(sagaMiddleware)
    return middleware
  },
  devTools: process_env !== 'production',
})

export type AppDispatch = typeof store.dispatch
sagaMiddleware.run(rootSaga)

export default store
