import { connect } from 'dva'
import * as _ from 'lodash'
import React from 'react'
import DarkHeader from 'src/components/Header/DarkHeader'
import { IBaseProps } from 'src/mixin/IBaseProps'
import userService from 'src/services/userService'
import { LoadAbleData } from 'src/types/Common/LoadAbleData'
import { MessageCountDto } from 'src/types/User/MessageCountDto'
import { MessageDto } from 'src/types/User/MessageDto'
import { MessageType } from 'src/utils/enum/MessageType'
import style from './Message.scss'

interface IState {
  reply: LoadAbleData<MessageDto>
  at: LoadAbleData<MessageDto>
  currentTab: Tabs
  messageCount: MessageCountDto
}

enum Tabs {
  reply = 'reply',
  at = 'at'
}

class Message extends React.Component<IBaseProps, IState> {
  public state = {
    reply: new LoadAbleData<MessageDto>(8),
    at: new LoadAbleData<MessageDto>(8),
    currentTab: Tabs.reply,
    messageCount: new MessageCountDto()
  }

  private dispatch = this.props.dispatch

  public constructor(props) {
    super(props)
    userService.getUnknownMessageCount().then((o) => {
      this.state.messageCount = o
    })
  }

  public componentDidMount() {
    this.switchTab(Tabs.reply)
  }

  public render() {
    const replys = this.state.reply.data
    const replyEmpty = this.state.reply.isEmpty
    const ats = this.state.at.data
    const { currentTab, messageCount } = this.state
    const atEmpty = this.state.at.isEmpty
    return (
      <div className={style.Message}>
        <DarkHeader title={'我的消息'} />
        <div className={style.main}>
          <div className={style.tab}>
            <div
              className={style.item}
              onClick={this.switchTab.bind(this, Tabs.reply)}
            >
              回复{' '}
              {messageCount.unknownReplyCount > 0 ? (
                <span className={style.badge} />
              ) : (
                ''
              )}
            </div>
            <div
              className={style.item}
              onClick={this.switchTab.bind(this, Tabs.at)}
            >
              @我{' '}
              {messageCount.unknownAtCount > 0 ? (
                <span className={style.badge} />
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={style.list}>
            {currentTab === Tabs.reply ? (
              replyEmpty ? (
                <div className={style.empty}>还没有任何回复</div>
              ) : (
                <ul>
                  {replys.map((o: MessageDto, i) => (
                    <li key={i}>
                      <div className={style.item}>
                        <div className={style.left}>
                          <div
                            className={style.headImg}
                            style={{
                              backgroundImage: o.sender.headImg
                                ? `url(${o.sender.headImg})`
                                : ''
                            }}
                          />
                        </div>
                        <div className={style.right}>
                          <p className={style.userName}>{o.sender.userName}</p>
                          <p className={style.content}>{o.content}</p>
                          <div className={style.fromThread}>
                            {o.threadTitle}
                          </div>
                          <div className={style.bottom}>
                            <span className={style.fromTieba}>
                              {o.tiebaTitle}
                            </span>
                            <span className={style.time}>
                              {o.createTimeStr}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              ''
            )}
            {currentTab === Tabs.at ? (
              atEmpty ? (
                <div className={style.empty}>还没有任何@</div>
              ) : (
                <ul>
                  {ats.map((o: MessageDto, i) => (
                    <li key={i}>
                      <div className={style.item}>
                        <div className={style.left}>
                          <div
                            className={style.headImg}
                            style={{
                              backgroundImage: o.sender.headImg
                                ? `url(${o.sender.headImg})`
                                : ''
                            }}
                          />
                        </div>
                        <div className={style.right}>
                          <p className={style.userName}>{o.sender.userName}</p>
                          <p className={style.content}>{o.content}</p>
                          <div className={style.fromThread}>
                            {o.threadTitle}
                          </div>
                          <div className={style.bottom}>
                            <span className={style.fromTieba}>
                              {o.tiebaTitle}
                            </span>
                            <span className={style.time}>
                              {o.createTimeStr}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    )
  }

  private switchTab = (type: Tabs) => {
    // this.setState({currentTab: type})
    const data: LoadAbleData<any> = this.state[type]
    const state: any = this.state
    this.setState({ currentTab: type })
    if (!data.isLoaded) {
      switch (type) {
        case Tabs.reply:
          userService.getMessage(MessageType.reply).then((o) => {
            /*            const obj: any = { [type]: { ...state[type],data: o,isLoaded: true } }
                        this.setState({ ...obj,messageCount: { ...state.messageCount,unknownReplyCount: 0 } })*/
            state[type].data = o
            state.messageCount.unknownReplyCount = 0
            state.currentTab = Tabs.reply
            this.setState(state)
          })
          break
        case Tabs.at:
          userService.getMessage(MessageType.at).then((o) => {
            /*            const obj: any = { [type]: { ...state[type],data: o,isLoaded: true } }
                        this.setState({ ...obj,messageCount: { ...state.messageCount,unknownAtCount: 0 } })*/
            state[type].data = o
            state.messageCount.unknownAtCount = 0
            state.currentTab = Tabs.at
            this.setState(state)
          })
      }
    }
  }
}

export default connect((state) => {
  return { ...state }
})(Message)
