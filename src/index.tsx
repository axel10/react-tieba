import axios, { AxiosError } from 'axios'
import dva from 'dva'
import { createBrowserHistory as createHistory } from 'history'
import * as React from 'react'
import { Dispatch } from 'redux'
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

import history from 'src/history'
import Message from 'src/utils/Message'
import { clearToast, toast } from 'src/utils/utils'

// 1. Initialize
const app = dva({
  history
})

const positionRecord = {}
const historyKeys = [history.location.key]
let lastPathname = history.location.pathname

history.listen(((location1, action) => {

  if (lastPathname === history.location.pathname) {
    return
  }

  const currentRouterKey = history.location.key
  const oldScrollTop = window.scrollY
  const originPage = document.getElementById('routeWrap').children[0] as HTMLElement
  originPage.style.position = 'fixed'
  originPage.style.top = -oldScrollTop + 'px'

  console.log(currentRouterKey)

  setTimeout(() => {
    const wrap = document.getElementById('routeWrap')
    const newPage = wrap.children[0] as HTMLElement
    const oldPage = wrap.children[1] as HTMLElement
    if (!newPage || !oldPage) {
      return
    }
    if (newPage.className.split(' ')[0] === oldPage.className.split(' ')[0]) {
      return
    }
    const currentPath = history.location.pathname

    const lastKey = historyKeys[historyKeys.length - 1]
    const lastPrevKey = historyKeys[historyKeys.length - 2]

/*    if (lastPrevKey === currentRouterKey) {
      console.log('back')
    }*/
    if (lastKey === currentRouterKey) {
      console.log('forward')
    }

    if (action === 'PUSH' || lastKey === currentRouterKey) {
      // oldPage.style.top = `-${oldScrollTop}px`
      positionRecord[lastPathname] = oldScrollTop
      window.scrollTo({ top: 0 })

      if (lastKey !== currentRouterKey) {
        historyKeys.push(currentRouterKey)
      }
    } else {
      window.scrollTo({
        top: positionRecord[currentPath]
      })

      // 删除列表路由的所有子路由滚动记录
      for (const key in positionRecord) {
        console.log(key)
        if (key === currentPath) {
          continue
        }
        if (key.startsWith(currentPath)) {
          delete positionRecord[key]
        }
      }
    }

    newPage.style.width = '100%'
    oldPage.style.width = '100%'
    newPage.style.top = '0px'
    if (action === 'PUSH' || lastKey === currentRouterKey) {
      newPage.style.left = '100%'
      oldPage.style.left = '0'

      setTimeout(() => {
        newPage.style.transition = 'left .3s'
        oldPage.style.transition = 'left .3s'
        newPage.style.opacity = '1'
        newPage.style.left = '0'
        oldPage.style.left = '-100%'
        // newPage.style.opacity = '1'
      }, 50)
    } else {
      newPage.style.left = '-100%'
      oldPage.style.left = '0'
      setTimeout(() => {
        oldPage.style.transition = 'left .3s'
        newPage.style.transition = 'left .3s'
        newPage.style.left = '0'
        oldPage.style.left = '100%'
        newPage.style.opacity = '1'
      }, 50)
    }
    console.log(historyKeys)

    lastPathname = history.location.pathname

  })

}))

// 2. Plugins
// app.use(createLoading());

// 3. Model
//   app.model(m.default); // ts 导出格式包含default

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

// axios.defaults.baseURL = 'https://api.tieba.axel10.com'
axios.defaults.baseURL = config.baseUrl
axios.defaults.withCredentials = true

// 5. Start
app.start('#root')
