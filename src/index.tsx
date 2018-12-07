import axios from 'axios'
import dva, { DvaInstance } from 'dva'
import createLoading from 'dva-loading'
import * as React from 'react'
import { Dispatch } from 'redux'
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

// 1. Initialize
export const app: IDvaInstance = dva({
  history
})

const positionRecord = {}
let historyKeys = history.location.key ? [history.location.key] : ['']
let lastPathname = history.location.pathname

let currentHistoryPosition = 0

history.listen((() => {
/*  if (lastPathname === history.location.pathname) {
    return
  }*/
  if (history.location.state && history.location.state.noAnimate) {
    setTimeout(()=>{
      const wrap = document.getElementById('routeWrap')
      const newPage = wrap.children[0] as HTMLElement
      const oldPage = wrap.children[1] as HTMLElement
      newPage.style.opacity = '1'
      oldPage.style.display = 'none'
    })
    return
  }
  const { action } = history

  const currentRouterKey = history.location.key ? history.location.key : ''
  const oldScrollTop = window.scrollY
  const originPage = document.getElementById('routeWrap').children[0] as HTMLElement
  const oPosition = originPage.style.position
  originPage.style.position = 'fixed'
  originPage.style.top = -oldScrollTop + 'px'
  setTimeout(() => {
    originPage.style.position = oPosition
  }, config.routeAnimationDuration)

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

    const isForward = historyKeys[currentHistoryPosition + 1] === currentRouterKey

    if (action === 'PUSH' || isForward) {
      // oldPage.style.top = `-${oldScrollTop}px`
      positionRecord[lastPathname] = oldScrollTop
      window.scrollTo({ top: 0 })

      if (action === 'PUSH') {
        historyKeys = historyKeys.slice(0, currentHistoryPosition + 1)
        historyKeys.push(currentRouterKey)
      }
    } else {
      window.scrollTo({
        top: positionRecord[currentPath]
      })

      // 删除列表路由的所有子路由滚动记录
      for (const key in positionRecord) {
        if (key === currentPath) {
          continue
        }
        if (key.startsWith(currentPath)) {
          delete positionRecord[key]
        }
      }
    }

    if (action === 'REPLACE') {
      historyKeys[currentHistoryPosition] = currentRouterKey
    }

    newPage.style.width = '100%'
    oldPage.style.width = '100%'
    newPage.style.top = '0px'
    if (action === 'PUSH' || isForward) {
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
    currentHistoryPosition = historyKeys.indexOf(currentRouterKey)

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
app.use(createLoading())

// axios.defaults.baseURL = 'https://api.tieba.axel10.com'
axios.defaults.baseURL = config.baseUrl
axios.defaults.withCredentials = true

// 5. Start
app.start('#root')
