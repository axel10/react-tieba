import { connect } from 'dva'
import React from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { AnimatedSwitch } from 'react-router-transition'
import TiebaTab from 'src/components/Common/TiebaTab/TiebaTab'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { MessageCountDto } from 'src/types/User/MessageCountDto'
import Header from '../../components/Header/WhiteHeader'
import IndexTab from '../../components/IndexTabs/IndexTab'
import Recommend from '../../components/IndexTabs/Recommend'
import UserTab from '../../components/IndexTabs/UserTab'
import userService from '../../services/userService'
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

  constructor (props) {
    super(props)
    userService.getUnknownMessageCount().then((o) => {
      this.setState({ messageCount: o })
    })
  }

  public componentDidMount () {
  }

  public componentDidUpdate (prevProps, prevState) {
  }

  public render () {
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
              <i className='iconfont icon-search'/>
            </Link>
          }
          title='百度贴吧'
          right={
            <Link to={'/message'}>
              {messageCount > 0 ? (
                <span className={style.badge}>{messageCount}</span>
              ) : (
                ''
              )}
              <i className={'iconfont icon-bell'}/>
            </Link>
          }
        />

        <TiebaTab tabs={[
          { key: 'recommend',component: <Recommend/>,label: '推荐' },
          { key: '',component: <IndexTab/>,label: '首页' },
          { key: 'user',component: <UserTab/>,label: '我的' }
        ]} {...this.props} />

      </div>
    )
  }
}

export default connect((state) => {
  return { index: state.index }
})(Index)
