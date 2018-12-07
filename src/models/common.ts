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
    * checkIsLogin (p, { put, call }) {
      const result = yield call(userService.checkIsLogin)
      yield put({ type: 'setIsLogin', b: result.data })
    }
  },

  reducers: {
    setIsLogin (state: ICommonState, { b }) {
      state.isLogin = b
      return { ...state }
    }
  },
  subscriptions: {
    setup ({ dispatch }) {
      dispatch({ type: 'checkIsLogin' })
    }
  }
}

export default CommonModel
