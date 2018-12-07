import Schema from 'async-validator'
import { AxiosError } from 'axios'
import { connect } from 'dva'
import qs from 'qs'
import React from 'react'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { getBindFieldObj, historyGoBack } from 'src/utils/utils'
import WhiteHeader from '../../components/Header/WhiteHeader'
import history from '../../history'
import userService from '../../services/userService'
import Message from '../../utils/Message'
import style from './Login.scss'

interface IState {
  validator: any
  form: {
    username: string
    password: string
  }
  errorMsg: string,
  fromPath: string
}

class Login extends React.Component<IBaseProps, IState> {
  public state = {
    validator: {
      username: { required: true, message: '请输入用户名' },
      password: { required: true, message: '请输入密码' }
    },
    form: {
      username: '',
      password: ''
    },
    errorMsg: '',
    fromPath: '/'
  }

  constructor (props) {
    super(props)
    const qsParam = qs.parse(history.location.search.replace('?', ''))
    if (qsParam.fromPath) {
      this.state.fromPath = qsParam.fromPath
    }
  }

  public render () {
    return (
      <div className={style.LoginOrRegister}>
        <WhiteHeader
          title={'登录'}
          left={
            <i
              className={'iconfont icon-left'}
              onClick={historyGoBack.bind(this)}
            />
          }
        />
        <div className={style.main}>
          <div className={style.logo}>
            <img src={require('../../assets/baidu.png')} alt=''/>
          </div>
          <div className={style.inputGroup}>
            <div className={style.row}>
              <input
                name='username'
                type='text'
                placeholder='输入用户名'
                onInput={this.bindField}
              />
            </div>
            <div className={style.row}>
              <input
                name='password'
                type='password'
                placeholder='输入密码'
                onInput={this.bindField}
              />
            </div>
          </div>
          <div className={style.errorMsg}>{this.state.errorMsg}</div>
          <div className={style.submit} onClick={this.submit}>
            提交
          </div>
        </div>
      </div>
    )
  }

  private bindField = (e: React.FormEvent) => {
    const obj = getBindFieldObj(e)
    this.setState({ form: { ...this.state.form, ...obj } })
  }
  private submit = () => {
    const validator = new Schema(this.state.validator)
    validator.validate(this.state.form, (errs: Error[]) => {
      if (!errs) {
        userService
          .login(this.state.form)
          .catch((e) => {
            if (e.response.status === 499) {
              this.setState({ errorMsg: e.response.data.ErrorMsg })
            }
            throw e
          })
          .then(() => {
            Message.toast('登陆成功！')
            this.props.dispatch({ type: 'common/setIsLogin', b: true })
            history.push(this.state.fromPath)
          })
      }
    })
  }
}

export default connect((state) => {
  return { ...state }
})(Login)
