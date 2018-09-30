import { connect } from 'dva'
import React from 'react'
import ImagePane from 'src/components/Home/ImagePane'
import DarkHeader from '../../components/Header/DarkHeader'
import Dynamic from '../../components/Home/Dynamic'
import Fans from '../../components/Home/Fans'
import Follow from '../../components/Home/Follow'
import TiebaFollows from '../../components/Home/TiebaFollows'
import history from '../../history'
import { IBaseProps } from '../../mixin/IBaseProps'
import { IHomeState } from '../../models/home'
import style from './Home.scss'

interface IProps extends IBaseProps {
  home: IHomeState
}

interface IState {
  currentTab: HomeTab
  isHeadImgPaneShow: boolean
}

enum HomeTab {
  dynamic,
  tiebaFollow,
  follow,
  fans
}

class Home extends React.Component<IProps, IState> {
  public state: IState = {
    currentTab: HomeTab.dynamic,
    isHeadImgPaneShow: false
  }
  private dispatch = this.props.dispatch

  constructor(props) {
    super(props)
    this.dispatch({
      type: 'home/init',
      userName: this.props.match.params.userName
    })
  }
  public componentWillUnmount() {
    this.dispatch({ type: 'home/reset' })
  }

  public render() {
    const data = this.props.home.homeData
    const isHeadImgPaneShow = this.state.isHeadImgPaneShow
    let tab
    switch (this.state.currentTab) {
      case HomeTab.dynamic:
        tab = <Dynamic />
        break
      case HomeTab.tiebaFollow:
        tab = <TiebaFollows />
        break
      case HomeTab.follow:
        tab = <Follow />
        break
      case HomeTab.fans:
        tab = <Fans />
        break
    }

    const tabData = [
      {
        label: '帖子',
        count: data.postCount,
        click: this.switchTab.bind(this, HomeTab.dynamic),
        key: 'dynamic'
      },
      {
        label: '贴吧',
        count: data.tiebaFollowCount,
        click: this.switchTab.bind(this, HomeTab.tiebaFollow),
        key: 'tiebaFollow'
      },
      {
        label: '关注',
        count: data.followCount,
        click: this.switchTab.bind(this, HomeTab.follow),
        key: 'follow'
      },
      {
        label: '粉丝',
        count: data.fansCount,
        click: this.switchTab.bind(this, HomeTab.fans),
        key: 'fans'
      }
    ]

    /*      <li onClick={this.switchTab.bind(this,HomeTab.dynamic)}>
  <div className={style.num}>{data.postCount}</div>
  <div className={style.info}>帖子</div>
    </li>
    <li onClick={this.switchTab.bind(this,HomeTab.tiebaFollow)}>
  <div className={style.num}>{data.tiebaFollowCount}</div>
  <div className={style.info}>贴吧</div>
    </li>

    <li onClick={this.switchTab.bind(this,HomeTab.follow)}>
  <div className={style.num}>{data.followCount}</div>
  <div className={style.info}>关注</div>
    </li>
    <li onClick={this.switchTab.bind(this,HomeTab.fans)}>
  <div className={style.num}>{data.fansCount}</div>
  <div className={style.info}>粉丝</div>
    </li>*/

    return (
      <div className={style.Home}>
        <DarkHeader title={data.userName} />
        <div className={style.top}>
          <div
            className={style.headImg}
            style={{
              backgroundImage: data.headImg ? `url('${data.headImg}')` : ''
            }}
            onClick={this.showHeadImg}
          />
          <div className={style.right}>
            <p className={style.name}>{data.userName}</p>
            <div className={style.btns}>
              {data.isSelf ? (
                <div
                  className={style.default}
                  onClick={this.nav.bind(this, '/edituser')}
                >
                  编辑资料
                </div>
              ) : data.isFollowed ? (
                <div className={style.default} onClick={this.cancelFollow}>
                  取消关注
                </div>
              ) : (
                <div className={style.default} onClick={this.follow}>
                  关注
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={style.tab}>
          <ul>
            {tabData.map((o, i) => (
              <li
                onClick={o.click}
                className={
                  this.state.currentTab === HomeTab[o.key] ? style.active : ''
                }
                key={i}
              >
                <div className={style.num}>{o.count}</div>
                <div className={style.info}>{o.label}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className={style.container}>
          {tab}
          {/*          <div className={style.tieba}>tieba</div>
          <div className={style.attention}>attention</div>
          <div className={style.fens}>fens</div>*/}
        </div>
        <ImagePane
          onHide={this.handleImagePaneHide}
          isShow={isHeadImgPaneShow}
          imgUrl={data.headImg}
        />
      </div>
    )
  }
  private handleImagePaneHide = () => {
    this.setState({ isHeadImgPaneShow: false })
  }
  private showHeadImg = () => {
    this.setState({ isHeadImgPaneShow: true })
  }
  private switchTab = (type: HomeTab) => {
    this.setState({ currentTab: type })
  }
  private nav = (url) => {
    history.push(url)
  }
  private cancelFollow = () => {
    this.dispatch({
      type: 'home/cancelFollow',
      userName: this.props.match.params.userName
    })
  }
  private follow = () => {
    this.dispatch({
      type: 'home/follow',
      userName: this.props.match.params.userName
    })
  }
}

export default connect((state) => {
  return { ...state }
})(Home)
