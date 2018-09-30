import { Model } from 'dva'
import { IAllState } from 'src/index'
import { TiebaFollowDto } from 'src/types/Tieba/TiebaFollowDto'
import userService from '../services/userService'
import { UserListDto } from '../types/User/UserListDto'
import { IUserState } from './user'

export interface IIndexState {
  user: UserListDto
  isLogin: boolean | null
  followTiebas: TiebaFollowDto[]
}

export interface IModel extends Model {
  state: IIndexState
}

const IndexModel: IModel = {
  namespace: 'index',

  state: {
    user: new UserListDto(),
    isLogin: null,
    followTiebas: []
  },

  effects: {
    *getUserInfo(p, { call, put }) {
      try {
        const user = yield call(userService.getUserInfo)
        yield put({ type: 'setUserInfo', user })
        const data = yield call(userService.getTiebaFollow, {
          pageNo: 1,
          pageSize: 50,
          userName: user.userName
        })
        yield put({ type: 'getFollowTieba', data })
        yield put({ type: 'setIsLogin', b: true })
      } catch (e) {
        console.log(e)
        yield put({ type: 'setIsLogin', b: false })
      }
    },
    *removeFollowTieba({ follow }, { call, put, select }) {
      const result = yield call(userService.removeFollowTieba, follow.tiebaId)
      if (result) {
        const state: IIndexState = yield select((s: IAllState) => s.index)
        yield put({
          type: 'setData',
          key: 'followTiebas',
          val: state.followTiebas.filter((o) => o.tiebaId !== follow.tiebaId)
        })
      }
    }
  },

  reducers: {
    setUserInfo(state: IIndexState, { user }) {
      state.user = user
      state.isLogin = true
      return { ...state }
    },
    setIsLogin(state: IIndexState, { b }) {
      state.isLogin = b
      return { ...state }
    },
    getFollowTieba(state: IIndexState, { data }) {
      state.followTiebas = data
      return { ...state }
    },
    setData(state: IIndexState, { key, val }) {
      state[key] = val
      return { ...state }
    }
  }
}

export default IndexModel
