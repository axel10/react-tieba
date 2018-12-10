import { connect } from 'dva'
import React from 'react'
import { ICommonState } from 'src/models/common'
import history from '../../history'
import { IBaseProps } from '../../mixin/IBaseProps'
import userService from '../../services/userService'
import { historyPush } from '../../utils/utils'
import style from './CommonFooter.scss'

interface IProps extends IBaseProps {
  isLogin: boolean,
  common: ICommonState
}

class CommonFooter extends React.Component<IProps> {
  private dispatch = this.props.dispatch
  private ref: HTMLElement

  public render () {
    const { isLogin } = this.props.common
    return (
      <div className={style.CommonFooter} >
        <div className={style.logo} ref={(ref) => { this.ref = ref }}>
          <i className='iconfont icon-tieba'/>
        </div>
        <div className={style.toast}>年轻人的潮流文化社区</div>
        <div className={style.option}>
          {isLogin === true ? <span onClick={this.logout}>注销</span> : ''}
          {isLogin === null ? (
            ''
          ) : isLogin ? (
            ''
          ) : (
            <span>
              <span onClick={historyPush.bind(this, '/login')}>登录</span>
              <span onClick={historyPush.bind(this, '/register')}>注册</span>
            </span>
          )}
        </div>
        <div className={style.copyright}>©2018 Baidu</div>
      </div>
    )
  }

  private logout = () => {
    userService.logout().then(() => {
      // history.push('/')
      window.location.reload()
    })
  }
}

export default connect((state) => {
  return { ...state }
})(CommonFooter)
