import { connect } from 'dva'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { IHomeState } from 'src/models/home'
import userService from 'src/services/userService'
import { historyPush } from 'src/utils/utils'
import style from './TiebaFollows.scss'
interface IProps extends IBaseProps {
  home: IHomeState
}

interface IState {
  pageSize: number
  pageNo: number
}

class TiebaFollows extends React.Component<IProps, IState> {
  public state = {
    pageSize: 9,
    pageNo: 1
  }

  private dispatch = this.props.dispatch

  public constructor(props) {
    super(props)
    if (!this.props.home.tiebaFollows.isLoaded) {
      this.dispatch({
        type: 'home/getData',
        key: 'tiebaFollows',
        service: userService.getTiebaFollow
      })
    }
  }

  public render() {
    const { isEmpty, isEnd, data } = this.props.home.tiebaFollows
    return (
      <div className={style.TiebaFollows}>
        {isEmpty ? (
          <div className={style.empty}>他还没有关注任何贴吧</div>
        ) : (
          <ul>
            {data.map((o, i) => {
              return (
                <li
                  key={i}
                  onClick={historyPush.bind(this, `/tieba/${o.title}`)}
                >
                  <div
                    className={style.headImg}
                    style={{ backgroundImage: `url('${o.headImg}')` }}
                  />
                  <div className={style.right}>
                    <div className={style.top}>
                      <span className={style.title}>{o.title}</span>
                      <span className={style.level}>
                        LV:
                        {o.level}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
            {/*              {
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
})(withRouter(TiebaFollows))
