import { Model } from 'dva'
import userService from '../services/userService'

export interface IUserState {
  form: {
    username: string
    password: string
  }
  confirmPassword: string
  isAgree: boolean
  errorMsg:string
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
    isAgree: false,
    errorMsg:''
  },

  effects: {
    *login(payload, {put, call, select }) {
      const state: IUserState = yield select((s) => s.index)
      const form = state.form
      yield call(userService.login, form.username, form.password)


/*      userService
        .login(this.state.form)
        .catch((e) => {
          if (e.response.status === 499) {
            // this.setState({ errorMsg: e.response.data.ErrorMsg })
          }
          throw e
        })
        .then(() => {
          Message.toast('登陆成功！')
          history.push(this.state.fromPath)
        })
      */


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
