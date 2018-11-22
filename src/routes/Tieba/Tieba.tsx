import { connect } from 'dva'
import React from 'react'
import { Link } from 'react-router-dom'
import DarkHeader from 'src/components/Header/DarkHeader'
import WhiteHeader from 'src/components/Header/WhiteHeader'
import Pager from 'src/components/Pager/Pager'
import Popup, { IPopupItem } from 'src/components/Popup/Popup'
import history from 'src/history'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { ICommonState } from 'src/models/common'
import { ITiebaState } from 'src/models/tieba'
import { ThreadListDto } from 'src/types/Thread/ThreadListDto'
import { historyPush, requireLogin, showLoadingTip, toast } from 'src/utils/utils'
import style from './Tieba.scss'

interface IProps extends IBaseProps {
  tieba: ITiebaState
  common: ICommonState
}

interface IState {
  isShowPopup: boolean
  popupItems: IPopupItem[]
}

let position = 0

function handleScroll () {
  console.log(window.scrollY)
  position = window.scrollY
}

class Tieba extends React.Component<IProps, IState> {
  public state: IState = {
    isShowPopup: false,
    popupItems: [
      {
        label: '搜索',
        icon: <i className={'iconfont icon-search'}/>,
        callback: () => {
          historyPush(`/search`)
        }
      },
      {
        label: '消息',
        icon: <i className={'iconfont icon-bell'}/>,
        callback: () => {
          historyPush(`/message`)
        }
      }
    ]
  }

  public container: HTMLElement

  private dispatch = this.props.dispatch

  private hasExperience: HTMLElement = null

  public componentWillUnmount () {
    console.log('unmount')
  }

  public componentDidMount () {
    this.dispatch({
      type: 'tieba/setTitle',
      title: this.props.match.params.title
    })
    this.dispatch({ type: 'tieba/init' })

    console.log(position)
  }

  public render () {
    const {
      hasTieba,
      levelInfo,
      title,
      followCount,
      postCount,
      headImg,
      isCanSign
    } = this.props.tieba.tiebaInfo
    const isFollow = levelInfo !== null

    const {
      data: threads,
      pageNo,
      pageCount,
      isEmpty
    } = this.props.tieba.threads
    return (
      <div className={style.Tieba} ref={(ref) => this.container = ref}>
        {hasTieba === true ? (
          <div className={style.main}>
            <div className={style.header}>
              <WhiteHeader
                title={title}
                left={
                  <Link replace={true} to={'/'}>
                    <i className={'iconfont icon-home'}/>
                  </Link>
                }
                right={
                  <span>
                    <a onClick={this.toNewPost}>
                      <i className='icon-edit-square iconfont'/>
                    </a>
                    <i
                      className='iconfont icon-more'
                      onClick={this.setPopupShow.bind(this, true)}
                    />
                  </span>
                }
              />
            </div>

            <div className={style.top}>
              <div
                className={style.headImg}
                style={{ backgroundImage: headImg ? `url(${headImg})` : '' }}
              />
              <div className={style.right}>
                <h5 className={style.title}>{title}吧</h5>
                {isFollow ? (
                  <div className={style.levelInfo}>
                    <p className={style.level}>
                      LV
                      {levelInfo.level}
                    </p>
                    <div className={style.experience + ' experience'}>
                      <span
                        className={style.hasExperience + ' hasExperience'}
                        ref={(ref) => (this.hasExperience = ref)}
                      />
                    </div>
                  </div>
                ) : (
                  <p>
                    {' '}
                    {followCount}
                    关注 {postCount}
                    帖子{' '}
                  </p>
                )}
              </div>
              <div className={style.btn}>
                {isFollow ? (
                  isCanSign ? (
                    <div className={style.follow} onClick={this.sign}>
                      签到
                    </div>
                  ) : (
                    <div className={style.follow}>已签到</div>
                  )
                ) : (
                  <div className={style.follow} onClick={this.follow}>
                    关注
                  </div>
                )}
              </div>
            </div>

            {isEmpty ? (
              <div className={style.empty}>这个吧还没有任何帖子</div>
            ) : (
              <div className={style.posts}>
                <div className={style.container}>
                  <ul>
                    {threads.map((o: ThreadListDto, i) => (
                      <li
                        className={style.postItem}
                        key={i}
                        onClick={this.toPost.bind(this, o.id)}
                      >
                        <div className={style.user}>
                          <div
                            className={style.headImg}
                            style={{
                              backgroundImage: o.creator.headImg
                                ? `url(${o.creator.headImg})`
                                : ''
                            }}
                          />
                          <div className={style.right}>
                            <p className={style.name}>{o.creator.userName}</p>
                            <p className={style.time}>{o.createTimeStr}</p>
                          </div>
                        </div>
                        <div className={style.title}>{o.title}</div>
                        <div className={style.footer}>
                          <span className={style.postCount}>
                            <i className='iconfont icon-message'/>
                            {o.postCount}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={style.pager}>
                  <Pager
                    totalPage={pageCount}
                    currentPage={pageNo}
                    onJump={this.jumpPage}
                  />
                </div>
              </div>
            )}
          </div>
        ) : hasTieba === false ? (
          <div className={style.noTieba}>
            <DarkHeader title={'创建贴吧'}/>
            <div className={style.noneImg}>
              <img src='/none.png' alt=''/>
            </div>
            <h4 className={style.title}>{title}吧</h4>
            <p className={style.toast}>欢迎创建此吧，和朋友们在这里交流</p>
            <div className={style.btn} onClick={this.create}>
              继续创建贴吧
            </div>
          </div>
        ) : (
          ''
        )}
        <Popup
          isShow={this.state.isShowPopup}
          onHide={this.setPopupShow.bind(this, false)}
          items={this.state.popupItems}
        />
      </div>
    )
  }

  private toNewPost = () => {
    const { isLogin } = this.props.common
    if (!isLogin) {
      requireLogin(history.location.pathname)
    } else {
      const { title } = this.props.tieba.tiebaInfo
      history.push(`/newPost/${title}`)
    }
  }

  private setPopupShow = (b) => {
    this.setState({ isShowPopup: b })
  }
  private create = () => {
    this.dispatch({ type: 'tieba/create', params: this.props.match.params })
  }
  private follow = () => {
    (this.dispatch({ type: 'tieba/follow' }) as any).then(() => {
      toast('关注成功！')
    })
  }
  private sign = () => {
    (this.dispatch({ type: 'tieba/sign' }) as any).then(() => {
      toast('签到成功！')
    })
  }
  private toPost = (id: number) => {
    history.push(`/p/${id}`)
  }
  // 页数调整
  private jumpPage = (pageNo: number) => {
    const done = showLoadingTip()
    const res: any = this.dispatch({ type: 'tieba/jump', pageNo })
    console.log(res)
    res.then(() => {
      done('')
    })
  }
}

export default connect((state) => {
  return { ...state }
})(Tieba)
