import { Model } from 'dva'
import userService from '../services/userService'

export interface ICommonState {
  isLogin: boolean
}

export interface IModel extends Model {
  state: ICommonState
}

const CommonModel: IModel = {
  namespace: 'common',

  state: {
    isLogin: false
  },

  effects: {
    *checkIsLogin(p, { put, call }) {
      const result = yield call(userService.checkIsLogin)
      if (result) {
        yield put({ type: 'setIsLogin', b: true })
      } else {
        yield put({ type: 'setIsLogin', b: false })
      }
    }
  },

  reducers: {
    setIsLogin(state: ICommonState, { b }) {
      state.isLogin = b
      return { ...state }
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'common/checkIsLogin' })
    }
  }
}

export default CommonModel
