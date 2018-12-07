import { connect } from 'dva'
import React from 'react'
import { withRouter } from 'react-router'
import history from 'src/history'
import postService from 'src/services/postService'
import userService from 'src/services/userService'
import { IBaseProps } from '../../mixin/IBaseProps'
import { IHomeState } from '../../models/home'
import style from './Dynamic.scss'

interface IState {
  pageSize: number
  pageNo: number
}

interface IProps extends IBaseProps {
  home: IHomeState
}

class Dynamic extends React.Component<IProps, IState> {
  public state: IState = {
    pageSize: 6,
    pageNo: 1
  }

  private dispatch = this.props.dispatch

  public constructor (props) {
    super(props)
    if (!this.props.home.dynamics.isLoaded) {
      this.dispatch({
        type: 'home/getData',
        key: 'dynamics',
        service: userService.getDynamic
      })
    }
  }

  public render () {
    const { isEmpty, isEnd, data } = this.props.home.dynamics
    return (
      <div className={style.Dynamic}>
        {isEmpty ? (
          <div className={style.empty}>他还没有任何动态</div>
        ) : (
          <ul>
            {data.map((o, i) => (
              <li key={i} id={o.threadId.toString()} onClick={this.jumpToPost(o.threadId,o.postId)}>
                <p className={style.threadContent}>{o.content}</p>
                {o.postId ? (
                  <div className={style.thread}>
                    <h5 className={style.title}>{o.thread.title}</h5>
                    <p className={style.content}>{o.thread.content}</p>
                    <div className={style.imgs}>
                      {o.thread.covers && o.thread.covers.length
                        ? o.thread.covers.map((img, j) => (
                          <img src={img} alt='' key={j}/>
                        ))
                        : ''}
                    </div>
                  </div>
                ) : (
                  ''
                )}
                <div className={style.bottom}>
                  {o.postId ? '回复' : '发表'}于 {o.tiebaTitle}吧{' '}
                  {o.createTimeStr}
                </div>
              </li>
            ))}
            {/* {
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

  private jumpToPost = (threadId,postId) => () => {
    if (postId) {
      postService.getPageNo(postId).then(pageNo => {
        history.push(`/p/${threadId}/${pageNo}/${postId}`)
      })
    } else {
      history.push(`/p/${threadId}`)
    }
  }
}

export default connect((state) => {
  return { ...state }
})(withRouter(Dynamic))
