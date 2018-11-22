import { connect } from 'dva'
import React from 'react'
import userService from 'src/services/userService'
import history from '../../history'
import { IBaseProps } from '../../mixin/IBaseProps'
import { IIndexState } from '../../models'
import style from './UserTab.scss'

interface IProps extends IBaseProps {
  index: IIndexState
}

class UserTab extends React.Component<IProps> {
  private dispatch = this.props.dispatch

  public constructor(props) {
    super(props)
    if (this.props.index.isLogin === null) {
      this.dispatch({ type: 'index/getUserInfo' })
    }
  }

  public render() {
    const userDto = this.props.index.user
    const isLogin = this.props.index.isLogin
    return (
      <div className={style.UserTab}>
        <div
          className={style.user}
          onClick={this.nav.bind(
            this,
            isLogin ? `/home/${userDto.userName}` : '/login'
          )}
        >
          <div
            className={style.headImg}
            style={{
              backgroundImage: isLogin ? `url(${userDto.headImg})` : ''
            }}
          />
          <div className={style.info}>
            <h4 className={style.name}>
              {isLogin ? userDto.userName : '未登录'}
            </h4>
            <p className={style.info}>
              {isLogin ? '' : '登录后发帖评论畅所欲言'}
            </p>
          </div>
          <i className="iconfont icon-next" />
        </div>
        <div className={style.options}>
          <ul>
            <li>
              <i className="iconfont icon-starmarkhighligh" />
              <div className={style.text} onClick={this.nav.bind(this, '/tc')}>
                我的收藏
              </div>
              <i className="iconfont icon-next" />
            </li>
          </ul>
        </div>
        <div className={style.logout} onClick={this.logout}>
          <p>退出登录</p>
        </div>
      </div>
    )
  }
  private nav = (url: string) => {
    history.push(url)
  }
  private logout = () => {
    userService.logout().then(() => {
      history.push('/')
    })
    this.dispatch({ type: 'index/getUserInfo' })
  }
}

export default connect((state) => {
  return { ...state }
})(UserTab)
