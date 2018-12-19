import axios from 'axios'
import dva, { DvaInstance } from 'dva'
import createLoading from 'dva-loading'
import * as React from 'react'
import { Dispatch } from 'redux'
import { defaults, initRouter } from 'src/components/SlideRouter'
import history from 'src/history'
import common, { ICommonState } from 'src/models/common'
import config from 'src/utils/config'
import './index.scss'
import followPost, { IFollowPostState } from './models/followPost'
import home, { IHomeState } from './models/home'
import index, { IIndexState } from './models/index'
import post, { IPostState } from './models/post'
import search, { ISearchState } from './models/search'
import tieba, { ITiebaState } from './models/tieba'
import tieCollection, { ITieCollectionState } from './models/tieCollection'
import user, { IUserState } from './models/user'
import { routes } from './router'

export interface IDvaInstance extends DvaInstance {
  _store?: any
}

initRouter()

// 1. Initialize
export const app: IDvaInstance = dva({
  history
})

export let dispatch: Dispatch

app.model({
  namespace: 'init',
  state: {},
  subscriptions: {
    setup (obj) {
      dispatch = obj.dispatch
    }
  }
})

app.model(search)
app.model(tieba)
app.model(post)
app.model(followPost)
app.model(tieCollection)
app.model(user)
app.model(home)
app.model(index)
app.model(common)

export interface IAllState {
  search: ISearchState
  tieba: ITiebaState
  post: IPostState
  followPost: IFollowPostState
  tieCollection: ITieCollectionState
  user: IUserState
  home: IHomeState
  index: IIndexState
  common: ICommonState
}

// 4. Router
app.router(routes)
app.use(createLoading())

// axios.defaults.baseURL = 'https://api.tieba.axel10.com'
axios.defaults.baseURL = config.baseUrl
axios.defaults.withCredentials = true

// 5. Start
app.start('#root')
