import axios from 'axios'
import dva from 'dva'
import { createBrowserHistory as createHistory } from 'history'
import { Dispatch } from 'redux'
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
import { router } from './router'

// 1. Initialize
const app = dva({
  history: createHistory()
})

// 2. Plugins
// app.use(createLoading());

// 3. Model
//   app.model(m.default); // ts 导出格式包含default

export let dispatch: Dispatch

app.model({
  namespace: 'init',
  state: {},
  subscriptions: {
    setup(obj) {
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

export interface IAllState {
  search: ISearchState
  tieba: ITiebaState
  post: IPostState
  followPost: IFollowPostState
  tieCollection: ITieCollectionState
  user: IUserState
  home: IHomeState
  index: IIndexState
}

// 4. Router
app.router(router)

// axios.defaults.baseURL = 'https://api.tieba.axel10.com'
axios.defaults.baseURL = config.baseUrl
axios.defaults.withCredentials = true

// 5. Start
app.start('#root')
