import { Model } from 'dva'
import * as _ from 'lodash'
import { LoadAble } from 'src/types/Common/LoadAble'
import { clone } from 'src/utils/utils'
import { IAllState } from '..'
import userService from '../services/userService'
import { TiebaFollowDto } from '../types/Tieba/TiebaFollowDto'
import { UserDynamicDto } from '../types/User/UserDynamicDto'
import { UserHomeDto } from '../types/User/UserHomeDto'
import { UserListDto } from '../types/User/UserListDto'

export interface IHomeState {
  homeData: UserHomeDto
  tiebaFollows: LoadAble<TiebaFollowDto>
  follows: LoadAble<UserListDto>
  fans: LoadAble<UserListDto>
  dynamics: LoadAble<UserDynamicDto>
  isLoading: boolean
  userId: number
  userName: string
}

const initState: IHomeState = {
  homeData: new UserHomeDto(),
  dynamics: new LoadAble(6),
  tiebaFollows: new LoadAble(6),
  follows: new LoadAble(9),
  fans: new LoadAble(9),
  isLoading: false,
  userId: null,
  userName: ''
}

export interface IModel extends Model {
  state: IHomeState
}

const HomeModel: IModel = {
  namespace: 'home',

  state: _.cloneDeep(initState),

  effects: {
    *init({ userName }, { put, call }) {
      yield put({ type: 'setData', key: 'userName', val: userName })
      const homeData: UserHomeDto = yield call(
        userService.getHomeData,
        userName
      )
      yield put({ type: 'setHomeData', homeData })
    },
    *getData({ key, service }, { put, call, select }) {
      const state: IHomeState = yield select((s: IAllState) => s.home)
      const scrollable: LoadAble<object> = state[key]
      if (scrollable.isLoading) return
      const data = yield call(service, {
        pageSize: scrollable.pageSize,
        pageNo: scrollable.pageNo,
        userName: state.userName
      })
      if (!data.length && !scrollable.data.length) {
        yield put({ type: 'setIsEmpty', b: true, key })
      }

      if (key === 'dynamics') {
        const replaceImg = (o: any) => {
          // console.log(o.content)
          // const imgs = o.content.match(/<img.*?src=['"](.+?)['"].*?><\/img>/)
          const imgs = []
          const reg = /<img.*?src=['"](.+?)['"].*?><\/img>/
          o.content.replace(reg, (match, g1) => {
            if (g1) {
              imgs.push(g1)
            }
          })
          if (imgs && imgs.length) {
            o.covers = imgs
          }
          o.content = o.content.replace(/<img.*?<\/img>/g, '')
        }
        data.forEach((o: UserDynamicDto) => {
          replaceImg(o)
          replaceImg(o.thread)
        })
      }

      yield put({ type: 'addScrollData', key, val: data })
    },

    *follow({ userName }, { put, call, select }) {
      if (yield select((s: IAllState) => s.home.isLoading)) return
      yield put({ type: 'setData', key: 'isLoading', val: true })

      yield call(userService.follow, userName)
      yield put({ type: 'setIsFollow', b: true })
      yield put({ type: 'setData', key: 'isLoading', val: false })
    },
    *cancelFollow({ userName }, { put, call, select }) {
      if (yield select((s: IAllState) => s.home.isLoading)) return
      yield put({ type: 'setData', key: 'isLoading', val: true })
      yield call(userService.cancelFollow, userName)
      yield put({ type: 'setIsFollow', b: false })
      yield put({ type: 'setData', key: 'isLoading', val: false })
    }
  },

  reducers: {
    setHomeData(state: IHomeState, { homeData }) {
      state.homeData = homeData
      return { ...state }
    },
    setIsEmpty(state: IHomeState, { key, b }) {
      const scrollable: LoadAble<object> = state[key]
      scrollable.isEmpty = b
      return { ...state }
    },
    setData(state: IHomeState, { key, val }) {
      state[key] = val
      return { ...state }
    },
    addScrollData(state: IHomeState, { key, val }) {
      const scrollAble: LoadAble<object> = state[key]
      scrollAble.data = scrollAble.data.concat(val)
      if (val.length < scrollAble.pageSize) {
        scrollAble.isEnd = true
      }
      return { ...state }
    },
    setIsFollow(state: IHomeState, { b }) {
      state.homeData.isFollowed = b
      return { ...state }
    },
    setLoading(state: IHomeState, { key, b }) {
      state[key].isLoading = b
      return { ...state }
    },
    reset(state: IHomeState) {
      state = _.cloneDeep(initState)
      return { ...state }
    }
  }
}

export default HomeModel
