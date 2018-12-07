import Schema from 'async-validator'
import { connect } from 'dva'
import qs from 'qs'
import React from 'react'
import WhiteHeader from 'src/components/Header/WhiteHeader'
import history from 'src/history'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { IUserState } from 'src/models/user'
import userService from 'src/services/userService'
import { getBindFieldObj, historyGoBack } from 'src/utils/utils'
import style from '../Login/Login.scss'

interface IProps extends IBaseProps {
  user: IUserState
}

interface IState {
  form: {
    username: string
    password: string
    confirmPassword: string
  }
  fromUrl: string
  isAgree: boolean
  descriptor: any
  errorMsg: string
}

class Register extends React.Component<IProps, IState> {
  public state = {
    form: {
      username: '',
      password: '',
      confirmPassword: ''
    },
    fromUrl: '',
    isAgree: false,
    descriptor: {},
    errorMsg: ''
  }

  private dispatch = this.props.dispatch

  public componentDidMount() {
    this.setState({
      descriptor: {
        username: { required: true, message: '请输入用户名' },
        password(rule: any, value: string, callback, source) {
          const err = []
          if (!value) {
            err.push(new Error('请输入密码'), rule.field)
          }
          if (value !== source.confirmPassword) {
            err.push(new Error('两次输入的密码不一致'), rule.field)
          }
          callback(err)
        }
      }
    })
  }

  public render() {
    return (
      <div className={style.LoginOrRegister}>
        <WhiteHeader
          title={'注册贴吧账号'}
          left={
            <i
              className={'iconfont icon-left'}
              onClick={historyGoBack.bind(this)}
            />
          }
        />
        <div className={style.main}>
          <div className={style.logo}>
            <img src={require('../../assets/baidu.png')} alt="" />
          </div>
          <div className={style.inputGroup}>
            <div className={style.row}>
              <input
                name="username"
                type="text"
                placeholder="输入用户名"
                onInput={this.handleFormInput}
              />
            </div>
            <div className={style.row}>
              <input
                name="password"
                type="password"
                placeholder="输入密码"
                onInput={this.handleFormInput}
              />
            </div>
            <div className={style.row}>
              <input
                name="confirmPassword"
                type="password"
                placeholder="确认密码"
                onInput={this.handleFormInput}
              />
            </div>
          </div>
          <div className={style.errorMsg}>{this.state.errorMsg}</div>
          <div
            className={`${style.submit} ${
              this.state.isAgree ? '' : style.disabled
            }`}
            onClick={this.submit}
          >
            提交
          </div>
          <div className={style.confirm}>
            <label>
              <input type="checkbox" name="isAgree" onChange={this.bindField} />
              同意并阅读百度用户协议及百度隐私保护声明
            </label>
          </div>
        </div>
      </div>
    )
  }

  private handleFormInput = (e: React.FormEvent) => {
    const el = e.target as HTMLInputElement
    const val = el.value
    const key = el.name
    const form = this.state.form
    if (key in form) {
      form[key] = val
      this.setState({ form })
    } else {
      const obj = {}
      obj[key] = val
      this.setState(obj)
    }
  }

  private bindField = (e: React.FormEvent) => {
    const obj = getBindFieldObj(e)
    this.setState(obj)
  }

  private submit = () => {
    if (!this.state.isAgree) {
      return
    }
    const des = this.state.descriptor

    const validator = new Schema(des)
    validator.validate(this.state.form, (errs: Error[]) => {
      if (errs) {
        this.setState({ errorMsg: errs[0].message })
      }
      if (!errs) {
        // this.dispatch({type: 'user/register', username: this.state.form.username, password: this.state.form.password})
        userService
          .register(this.state.form.username, this.state.form.password)
          .catch((e) => {
            this.setState({ errorMsg: e.response.data.ErrorMsg })
          })
          .then((o) => {
            if (o === 'true') {
              const search = qs.parse(this.props.location.search)
              if (search.fromUrl) {
                history.push(search.fromUrl)
              } else {
                history.push('/')
              }
            }
          })
      }
    })
  }
}

export default connect((state) => {
  return { ...state }
})(Register)
