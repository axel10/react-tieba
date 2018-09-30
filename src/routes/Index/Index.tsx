import { connect } from 'dva'
import React from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { AnimatedSwitch } from 'react-router-transition'
import {
  CSSTransition,
  Transition,
  TransitionGroup
} from 'react-transition-group'
import Header from '../../components/Header/WhiteHeader'
import IndexTab from '../../components/IndexTabs/IndexTab'
import Recommend from '../../components/IndexTabs/Recommend'
import UserTab from '../../components/IndexTabs/UserTab'
import { IBaseProps } from '../../mixin/IBaseProps'
import userService from '../../services/userService'
import { MessageCountDto } from '../../types/User/MessageCountDto'
import style from './Index.scss'

interface IState {
  messageCount: MessageCountDto
}

class Index extends React.Component<IBaseProps, IState> {
  public state = {
    prePath: '',
    messageCount: new MessageCountDto()
  }

  private tabs = [
    {
      component: Recommend,
      label: '推荐',
      key: 'recommend'
    },
    {
      component: IndexTab,
      label: '首页',
      key: ''
    },
    {
      component: UserTab,
      label: '我的',
      key: 'user'
    }
  ]

  private strip: HTMLDivElement
  private tabBar: HTMLUListElement

  constructor(props) {
    super(props)
    userService.getUnknownMessageCount().then((o) => {
      this.setState({ messageCount: o })
    })
  }

  public componentDidMount() {
    const strip: HTMLElement = this.strip
    const currentIndex = this.tabs.findIndex(
      (o) =>
        `${this.props.match.url}${o.key}` === `${this.props.location.pathname}`
    )
    const currentTab: HTMLElement = this.tabBar.children[
      currentIndex
    ] as HTMLElement
    if (!currentTab || !strip) return
    strip.style.left = currentTab.offsetLeft + 'px'
    strip.style.width = currentTab.offsetWidth + 'px'
  }

  public componentDidUpdate(prevProps, prevState) {
    setTimeout(() => {
      const currentTabContainer: HTMLElement = document.querySelector(
        '.index-tab-exit'
      )
      const newTab: HTMLElement = document.querySelector('.index-tab-enter')
      if (!currentTabContainer || !newTab) return
      newTab.style.opacity = '1'
      currentTabContainer.style.transition = 'all .6s'
      const location = this.props.location
      const currentIndex = this.tabs.findIndex(
        (o) =>
          `${this.props.match.url}${o.key}` ===
          `${this.props.location.pathname}`
      )
      const preIndex = this.tabs.findIndex(
        (o) =>
          `${this.props.match.url}${o.key}` ===
          `${location.state && location.state.prePath}`
      )
      const direction = preIndex > currentIndex ? 'pre' : 'next'
      const strip: HTMLElement = this.strip
      const currentTab: HTMLElement = this.tabBar.children[
        currentIndex
      ] as HTMLElement
      const preTab: HTMLElement = this.tabBar.children[preIndex] as HTMLElement

      if (!currentTab || !preTab) return

      if (direction === 'pre') {
        const stripWidth =
          preTab.offsetLeft - currentTab.offsetLeft + preTab.offsetWidth

        currentTabContainer.style.transform = 'translateX(100%)'
        newTab.style.transition = 'none'
        newTab.style.transform = 'translateX(-100%)'

        strip.style.right =
          document.body.clientWidth -
          (preTab.offsetWidth + preTab.offsetLeft) +
          'px'
        strip.style.left = 'auto'
        strip.style.width = stripWidth + 'px'

        setTimeout(() => {
          strip.style.right = 'auto'
          strip.style.left = currentTab.offsetLeft + 'px'
          strip.style.width = currentTab.offsetWidth + 'px'
        }, 200)

        setTimeout(() => {
          newTab.style.transition = 'transform .6s'
          newTab.style.transform = 'translateX(0)'
        }, 50)
      } else {
        const stripWidth =
          currentTab.offsetLeft - preTab.offsetLeft + currentTab.offsetWidth

        currentTabContainer.style.transform = 'translateX(-100%)'
        newTab.style.transition = 'none'
        newTab.style.transform = 'translateX(100%)'

        strip.style.left = preTab.offsetLeft + 'px'
        strip.style.right = 'auto'
        strip.style.width = stripWidth + 'px'

        setTimeout(() => {
          strip.style.left = 'auto'
          strip.style.right =
            document.body.clientWidth -
            (currentTab.offsetWidth + currentTab.offsetLeft) +
            'px'
          strip.style.width = currentTab.offsetWidth + 'px'
        }, 200)

        setTimeout(() => {
          newTab.style.transition = 'transform .6s'
          newTab.style.transform = 'translateX(0)'
        }, 50)
      }
    })
  }

  public render() {
    const match = this.props.match
    const location = this.props.location
    const msgCountDto = this.state.messageCount
    const messageCount =
      msgCountDto.unknownAtCount + msgCountDto.unknownReplyCount > 0
        ? msgCountDto.unknownAtCount + msgCountDto.unknownReplyCount
        : 0
    return (
      <div className={style.Index}>
        <Header
          left={
            <Link to={'/search'}>
              <i className="iconfont icon-search" />
            </Link>
          }
          title="百度贴吧"
          right={
            <Link to={'/message'}>
              {messageCount > 0 ? (
                <span className={style.badge}>{messageCount}</span>
              ) : (
                ''
              )}
              <i className={'iconfont icon-bell'} />
            </Link>
          }
        />
        <div className={style.tabBar}>
          <div
            className={style.strip}
            ref={(ref) => {
              this.strip = ref
            }}
          />
          <ul
            ref={(ref) => {
              this.tabBar = ref
            }}
          >
            {this.tabs.map((o, i) => (
              <li key={i}>
                <Link
                  to={{
                    pathname: `${match.url}${o.key}`,
                    state: { prePath: location.pathname }
                  }}
                >
                  {o.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={style.container}>
          <TransitionGroup>
            <CSSTransition
              key={location.pathname}
              classNames={'index-tab'}
              timeout={600}
              mountOnEnter={false}
              unmountOnExit={false}
            >
              <Switch location={location}>
                {/*                {
                  tabs.map((o, i) => (
                    <Route key={i} component={o.component} path={`${this.props.match.url}${o.key}`} />
                  ))
                }*/}
                <Route exact={true} component={Recommend} path={'/recommend'} />
                <Route exact={true} component={IndexTab} path={'/'} />
                <Route exact={true} component={UserTab} path={'/user'} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    )
  }
}

export default connect((state) => {
  return { index: state.index }
})(Index)
