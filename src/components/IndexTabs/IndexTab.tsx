import { connect } from 'dva'
import React from 'react'
import * as router from 'react-router-redux'
import {
  CSSTransition,
  Transition,
  TransitionGroup
} from 'react-transition-group'
import TiebaGroup from 'src/components/Index/TiebaGroup'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { IIndexState } from 'src/models'
import { IndexTiebaDto } from 'src/types/Index/IndexTiebaDto'
import { TiebaFollowDto } from 'src/types/Tieba/TiebaFollowDto'
import { arrGroup, historyPush, numberToStr } from 'src/utils/utils'
import history from '../../history'
import CommonFooter from '../CommonFooter/CommonFooter'
import style from './IndexTab.scss'

interface IProps extends IBaseProps {
  index: IIndexState
}

interface IState {
  indexTiebas: IndexTiebaDto[]
  index: number
  isAnimate: boolean
  isEditMode: boolean
}

class IndexTab extends React.Component<IProps, IState> {
  public state: IState = {
    indexTiebas: [
      {
        title: '火影忍者',
        followCount: 10000000,
        postCount: 1000000,
        headImg: ''
      },
      { title: '死神', followCount: 900000, postCount: 90090, headImg: '' },
      {
        title: '宠物小精灵',
        followCount: 10000000,
        postCount: 1000000,
        headImg: ''
      },
      {
        title: '动感新时代',
        followCount: 10000000,
        postCount: 1000000,
        headImg: ''
      },
      { title: '愛', followCount: 10000000, postCount: 1000000, headImg: '' },
      { title: '灰原哀', followCount: 100000, postCount: 900000, headImg: '' },
      {
        title: '黑子的篮球',
        followCount: 10000000,
        postCount: 1000000,
        headImg: ''
      },
      { title: '爱情', followCount: 10000000, postCount: 1000000, headImg: '' },
      { title: '扒皮', followCount: 10000, postCount: 1000000, headImg: '' }
    ],
    index: 0,
    isAnimate: false,
    isEditMode: false
  }

  private dispatch = this.props.dispatch

  private isAnimate = false

  public constructor(props) {
    super(props)
    this.dispatch({ type: 'index/getUserInfo' })
  }

  public render() {
    const isLogin = this.props.index.isLogin
    const state = this.state
    const indexTiebas = state.indexTiebas
    const data: IndexTiebaDto[][] = arrGroup(indexTiebas, 3)
    const currentIndex = state.index
    const followTieba = this.props.index.followTiebas
    return (
      <div className={style.IndexTabs}>
        <div className={style.search} onClick={this.toSearch}>
          <span>
            <i className="iconfont icon-search" />
          </span>{' '}
          搜索一下
        </div>
        {isLogin && followTieba.length > 0 ? (
          <div className={style.myTieba}>
            <div className={style.top}>
              <p>我关注的吧</p>
              <p onClick={this.toggleEditMode}>
                {state.isEditMode ? '完成' : '编辑'}
              </p>
            </div>
            <ul>
              {followTieba.map((o, i) => (
                <li
                  key={i}
                  onClick={historyPush.bind(this, `/tieba/${o.title}`)}
                >
                  {state.isEditMode ? (
                    <span
                      className={style.remove}
                      onClick={this.removeFollowTieba.bind(this, o)}
                    >
                      <i className="iconfont icon-close" />
                    </span>
                  ) : (
                    ''
                  )}
                  <span className={style.title}>{o.title}</span>
                  <span className={style.level}>{o.level}</span>
                </li>
              ))}
            </ul>
            {followTieba.length > 8 ? (
              <div className={style.open}>展开全部</div>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
        <div className={style.interest}>
          <div className={style.top}>
            <div className={style.left}>我可能感兴趣的吧</div>
            <div className={style.right} onClick={this.addIndex}>
              换一换
            </div>
          </div>
          <div className={style.items}>
            <TransitionGroup>
              {data.map(
                (group: IndexTiebaDto[], i) =>
                  currentIndex === i ? (
                    <CSSTransition
                      key={i}
                      classNames={'tieba-item'}
                      timeout={1000}
                      unmountOnExit={false}
                    >
                      <ul>
                        {group.map((o, j) => (
                          <li
                            className={style.item}
                            key={j}
                            style={{ display: 'flex' }}
                          >
                            <div
                              className={style.headImg}
                              style={{
                                backgroundImage: o.headImg
                                  ? `url(${o.headImg})`
                                  : ''
                              }}
                            />
                            <div className={style.info}>
                              <div className={style.title}>{o.title}</div>
                              <div className={style.count}>
                                <span>
                                  {numberToStr(o.followCount)}
                                  关注
                                </span>
                                <span>
                                  {numberToStr(o.postCount)}
                                  贴子
                                </span>
                              </div>
                            </div>
                            <span className={style.follow}>关注</span>
                          </li>
                        ))}
                      </ul>
                    </CSSTransition>
                  ) : (
                    ''
                  )
              )}
            </TransitionGroup>
          </div>
        </div>
        <CommonFooter isLogin={isLogin} />
      </div>
    )
  }

  private removeFollowTieba = (follow: TiebaFollowDto, e: React.MouseEvent) => {
    e.stopPropagation()
    this.dispatch({ type: 'index/removeFollowTieba', follow })
  }

  private toggleEditMode = () => {
    const state = this.state
    this.setState({ isEditMode: !state.isEditMode })
  }

  private addIndex = () => {
    if (this.isAnimate) return
    this.isAnimate = true

    setTimeout(() => {
      this.isAnimate = false
    }, 1000)

    const state = this.state
    state.index = state.index >= 2 ? 0 : ++state.index

    setTimeout(() => {
      const enter = document.querySelector('.tieba-item-enter') as HTMLElement
      enter.style.left = 'auto'
      const exit = document.querySelector('.tieba-item-exit') as HTMLElement
      for (let i = 0; i < enter.children.length; i++) {
        const enterItem = enter.children[i] as HTMLElement
        enterItem.style.transition = 'none'
        enterItem.style.transform = 'translateX(110%)'
        enterItem.style.display = 'flex'

        setTimeout(() => {
          enterItem.style.transition = 'transform .33s'
          enterItem.style.transform = 'translateX(0%)'
        }, i * 200 + 100)
      }

      for (let i = 0; i < exit.children.length; i++) {
        setTimeout(() => {
          const exitItem = exit.children[i] as HTMLElement
          exitItem.style.transition = 'transform .3s'
          exitItem.style.transform = 'translateX(-110%)'
        }, i * 200 + 100)
      }
    })

    this.setState(state)
  }

  private toSearch = () => {
    // this.dispatch(router.push('/search'))
    history.push('/search')
  }
}

export default connect((state) => {
  return { ...state }
})(IndexTab)
