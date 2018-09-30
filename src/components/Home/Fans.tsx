import { connect } from 'dva'
import React from 'react'
import { withRouter } from 'react-router-dom'
import userService from 'src/services/userService'
import { historyPush } from 'src/utils/utils'
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

class Fans extends React.Component<IProps, IState> {
  public state = {
    pageSize: 9,
    pageNo: 1
  }

  private dispatch = this.props.dispatch

  public constructor(props) {
    super(props)

    if (!this.props.home.fans.isLoaded) {
      this.dispatch({
        type: 'home/getData',
        key: 'fans',
        service: userService.getFansList
      })
    }
  }

  public render() {
    const { isEmpty, isEnd, data } = this.props.home.fans

    return (
      <div className={style.FollowAndFans}>
        {isEmpty ? (
          <div className={style.empty}>他还没有任何粉丝</div>
        ) : (
          <ul>
            {data.map((o, i) => (
              <li
                key={i}
                onClick={historyPush.bind(this, `/home/${o.userName}`)}
              >
                <div
                  className={style.headImg}
                  style={{ backgroundImage: `url('${o.headImg}')` }}
                />
                <p className={style.userName}>{o.userName}</p>
              </li>
            ))}
            {/*            {
              isEnd ? (
                <li className={style.end}>
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
})(withRouter(Fans))
