import { Model } from 'dva'
import userService from '../services/userService'

export interface IUserState {
  form: {
    username: string
    password: string
  }
  confirmPassword: string
  isAgree: boolean
}

export interface IModel extends Model {
  state: IUserState
}

const UserModel: IModel = {
  namespace: 'user',

  state: {
    form: {
      username: '',
      password: ''
    },
    confirmPassword: '',
    isAgree: false
  },

  effects: {
    *login(payload, { call, select }) {
      const state: IUserState = yield select((s) => s.index)
      const form = state.form
      yield call(userService.login, form.username, form.password)
      // history.push(state.fromUrl)
    },
    *register({ username, password }, { call, select }) {
      // const state: IUserState = yield select(s => s.user)
      // const form = state.form
      yield call(userService.register, username, password)
      // history.push(state.fromUrl)
    }
  },

  reducers: {
    /*    setFromUrl (state: IUserState, { url }) {
      state.fromUrl = url
      return { ...state }
    },*/
    bindState(state: IUserState, { key, val }) {
      state[key] = val
      return { ...state }
    },
    bindField(state: IUserState, { key, val }) {
      state.form[key] = val
      return { ...state }
    }
  }
}

export default UserModel
