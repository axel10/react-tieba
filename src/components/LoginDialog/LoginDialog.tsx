import Schema from 'async-validator'
import * as React from 'react'
import Button from 'src/components/Button/Button'
import { IBaseProps } from 'src/mixin/IBaseProps'
import userService from 'src/services/userService'
import { getBindFieldObj, toast } from 'src/utils/utils'
import style from './LoginDialog.scss'
import { app } from 'src/index'
import history from 'src/history'

interface IProps extends IBaseProps {
  close (): void
}

const validate = {
  username: { required: true, message: '请输入用户名' },
  password: { required: true, message: '请输入密码' }
}

class LoginDialog extends React.Component<IProps, any> {

  public state = {
    form: {
      password: '',
      username: ''
    }
  }

  constructor (props) {
    super(props)
  }

  public submit = () => {
    const validator = new Schema(validate)
    validator.validate(this.state.form, (errs: Error[]) => {
      if (!errs) {

        userService
          .login(this.state.form)
          .catch((e) => {
            if (e.response.status === 499) {
              toast(e.response.data.ErrorMsg)
            }
            throw e
          })
          .then(() => {
            toast('登陆成功！')
            window.location.reload()
          })
      }
    })
  }

  public render () {

    const toRegister = ()=>{
      history.push('/register')
      this.props.close()
    }

    return (<div className={style.LoginDialog}>
      <div className={style.dialog}>
        <a className={style.close} onClick={this.props.close}/>
        <div className={style.title}>
          <div className={style.left}>
            登录百度账号
          </div>
          <div className={style.right}>
            <Button onClick={toRegister}>
              注册
            </Button>
          </div>
        </div>
        <div className={style.body}>
          <div className={style.form}>
            <div className={style.row}>
              <input type='text' name={'username'} onInput={this.bindField}/>
            </div>
            <div className={style.row}>
              <input type='password' name={'password'} onInput={this.bindField}/>
            </div>
            <div className={style.row}>
              <Button  onClick={this.submit}>登录</Button>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }

  private bindField = (e: React.FormEvent) => {
    const obj = getBindFieldObj(e)
    this.setState({ form: { ...this.state.form, ...obj } })
  }
}

export default LoginDialog
