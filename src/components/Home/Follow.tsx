import { connect } from 'dva'
import React from 'react'
import { withRouter } from 'react-router-dom'
import userService from 'src/services/userService'
import { IBaseProps } from '../../mixin/IBaseProps'
import { IHomeState } from '../../models/home'
import { UserListDto } from '../../types/User/UserListDto'
import style from './Follow.scss'

interface IState {
  pageSize: number
  pageNo: number
}

interface IProps extends IBaseProps {
  home: IHomeState
}

class Follow extends React.Component<IProps, IState> {
  public state = {
    pageSize: 9,
    pageNo: 1
  }
  private dispatch = this.props.dispatch

  public constructor(props) {
    super(props)
    if (!this.props.home.follows.isLoaded) {
      this.dispatch({
        type: 'home/getData',
        key: 'follows',
        service: userService.getFollowList
      })
    }
  }

  public render() {
    const { isEmpty, isEnd, data } = this.props.home.follows

    return (
      <div className={style.FollowAndFans}>
        {isEmpty ? (
          <div className={style.empty}>他还没有关注任何人</div>
        ) : (
          <ul>
            {data.map((o, i) => (
              <li key={i}>
                <div
                  className={style.headImg}
                  style={{ backgroundImage: `url('${o.headImg}')` }}
                />
                <p className={style.userName}>{o.userName}</p>
              </li>
            ))}
            {/*            {
              isEnd ? (
                <li className='end'>
                  <p>已经没有数据了</p>
                </li>
              ) : ''
            }*/}
          </ul>
        )}
      </div>
    )
  }
}

export default connect((state) => {
  return { ...state }
})(withRouter(Follow))
