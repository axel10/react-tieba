import { connect } from 'dva'
import React from 'react'
import WhiteHeader from 'src/components/Header/WhiteHeader'
import Pager from 'src/components/Pager/Pager'
import Popup, { IPopupItem } from 'src/components/Popup/Popup'
import PostItem from 'src/components/PostItem/PostItem'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { IPostState } from 'src/models/post'
import { PostDto } from 'src/types/Post/PostDto'
import { CollectionPostType } from 'src/utils/enum/CollectionPostType'
import { PostType } from 'src/utils/enum/PostType'
import {
  dropDownList,
  dropDownPosition,
  getTotalPage,
  goBack,
  historyPush
} from 'src/utils/utils'
import NewPost from '../NewPost/NewPost'
import style from './Post.scss'
import { CSSTransition } from 'react-transition-group'

interface IProps extends IBaseProps {
  post: IPostState
}

interface IState {
  isShowPopup: boolean
  popupItems: IPopupItem[]
}

class Post extends React.Component<IProps, IState> {
  public state: IState = {
    isShowPopup: false,
    popupItems: [
      {
        label: '只看楼主',
        icon: <i className={'iconfont icon-louzhu'}/>,
        callback: () => {
          historyPush(`/p/${this.props.post.thread.id}/1/1`)
        }
      }
    ]
  }

  private dispatch = this.props.dispatch

  public componentDidUpdate (preProps: IProps) {
    if (preProps.location.pathname !== this.props.location.pathname) {
      this.dispatch({ type: 'post/init', params: this.props.match.params })
    }
  }

  public componentDidMount () {
    this.dispatch({ type: 'post/init', params: this.props.match.params })
    document.querySelector('#routeWrap').scrollTo(0,0)
  }

  public render () {
    const data = this.props.post
    const { posts, thread, isShowPostInput, isShowFollowPostInput, pageSize, count, currentPostId } = data
    const params = this.props.match.params
    const currentPage = params.pageNo ? params.pageNo : 1
    const totalPage = getTotalPage(pageSize, count)
    return (
      <div className={style.Post}>
        <div className={style.header}>
          <WhiteHeader
            title={data.title}
            left={
              <span onClick={goBack}>
                <i className={'iconfont icon-left'}/>
              </span>
            }
            right={
              <span>
                <i
                  className={'iconfont icon-message'}
                  onClick={this.handlePostInputShow}
                />
                <i
                  className='iconfont icon-more'
                  onClick={this.setPopupShow.bind(this, true)}
                />
              </span>
            }
          />
        </div>
        <div className={style.thread}>
          <h3 className={style.title}>{thread.title}</h3>
          <PostItem
            type={PostType.thread}
            threadDto={thread}
            isTop={true}
            more={
              <i
                className='iconfont icon-ellipsis'
                onClick={this.showThreadDropDown}
              />
            }
          />
        </div>

        <div className={style.posts}>
          <ul>
            {posts.map((o: PostDto, i) => {
              return (
                <li key={i} data-postid={o.id}>
                  <PostItem
                    postDto={o}
                    type={PostType.post}
                    more={
                      <i
                        className='iconfont icon-ellipsis'
                        onClick={this.showPostDropDown.bind(this, o)}
                      />
                    }
                  />
                </li>
              )
            })}
          </ul>
        </div>
        <div className='pager'>
          <Pager currentPage={currentPage} totalPage={totalPage}/>
        </div>

        <CSSTransition classNames={'post-input'} timeout={600} in={isShowPostInput} unmountOnExit={true}>
          <div className={style.postInputWrap} >
            <NewPost
              onSend={this.handlePostInputHide}
              onHide={this.handlePostInputHide}
              type={PostType.post}
            />
          </div>
        </CSSTransition>

        <CSSTransition in={isShowFollowPostInput} classNames={'post-input'} timeout={600} unmountOnExit={true}>
          <div className={style.postInputWrap} >
            <NewPost
              onSend={this.handleFollowPostInputHide}
              onHide={this.handleFollowPostInputHide}
              type={PostType.followPost}
              postId={currentPostId}
            />
          </div>
        </CSSTransition>


        <Popup
          isShow={this.state.isShowPopup}
          onHide={this.setPopupShow.bind(this, false)}
          items={this.state.popupItems}
        />
      </div>
    )
  }

  private setPopupShow = (b) => {
    this.setState({ isShowPopup: b })
  }

  private handlePostInputHide = () => {
    this.dispatch({ type: 'post/setData', key: 'isShowPostInput', val: false })
  }
  private handlePostInputShow = () => {
    this.dispatch({ type: 'post/setData', key: 'isShowPostInput', val: true })
  }
  private handleFollowPostInputHide = () => {
    this.dispatch({
      type: 'post/setData',
      key: 'isShowFollowPostInput',
      val: false
    })
  }
  private handleFollowPostInputShow = () => {
    this.dispatch({
      type: 'post/setData',
      key: 'isShowFollowPostInput',
      val: true
    })
  }
  private showThreadDropDown = (e) => {
    const that = this
    const tieId = this.props.post.thread.id
    const options = []
    this.props.post.thread.isCollected
      ? options.push({
        label: '取消收藏',
        callback () {
          that.dispatch({
            type: 'post/cancelTieCollection',
            tType: CollectionPostType.Thread,
            tieId
          })
        }
      })
      : options.push({
        label: '收藏',
        callback () {
          that.dispatch({
            type: 'post/addTieCollection',
            tType: CollectionPostType.Thread,
            tieId
          })
        }
      })
    dropDownList(
      options,
      e.currentTarget as HTMLElement,
      dropDownPosition.leftBottom
    )
  }
  private showPostDropDown = (o: PostDto, e) => {
    this.dispatch({ type: 'post/setData', key: 'currentPostId', val: o.id })
    const that = this
    const el = e.currentTarget as HTMLElement
    const opts = []
    opts.push({
      label: '回复',
      callback () {
        that.handleFollowPostInputShow()
      }
    })
    o.isCollected
      ? opts.push({
        label: '取消收藏',
        callback () {
          that.dispatch({
            type: 'post/cancelTieCollection',
            tType: 2,
            tieId: o.id
          })
        }
      })
      : opts.push({
        label: '收藏',
        callback () {
          that.dispatch({
            type: 'post/addTieCollection',
            tType: 2,
            tieId: o.id
          })
        }
      })
    setTimeout(() => {
      dropDownList(opts, el, dropDownPosition.leftBottom)
    })
  }
}

export default connect((state) => {
  return { ...state }
})(Post)
