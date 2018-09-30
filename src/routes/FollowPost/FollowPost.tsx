import { connect } from 'dva'
import React from 'react'
import WhiteHeader from 'src/components/Header/WhiteHeader'
import PostItem from 'src/components/PostItem/PostItem'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { IFollowPostState } from 'src/models/followPost'
import { FollowPostDto } from 'src/types/Post/FollowPostDto'
import { PostType } from 'src/utils/enum/PostType'
import { dropDownList, dropDownPosition, goBack } from 'src/utils/utils'
import NewPost from '../NewPost/NewPost'
import style from './FollowPost.scss'

interface IProps extends IBaseProps {
  followPost: IFollowPostState
}

interface IState {
  currentItem: FollowPostDto
}

class FollowPost extends React.Component<IProps, IState> {
  public state: IState = {
    currentItem: null
  }

  private dispatch = this.props.dispatch

  public componentDidMount() {
    this.dispatch({ type: 'followPost/init', params: this.props.match.params })
    // document.body.addEventListener()
  }

  public componentWillUnmount() {
    this.dispatch({ type: 'followPost/reset' })
  }

  public render() {
    const followPost = this.props.followPost
    const post = followPost.post
    const postId = this.props.match.params.postId
    const followPosts = followPost.followPosts
    const isShowFollowPostInput = followPost.isShowFollowPostInput
    const currentItem = this.state.currentItem
    return (
      <div className={style.FollowPost}>
        <WhiteHeader
          title={post.floor ? post.floor + '楼' : ''}
          left={
            <span onClick={goBack}>
              <i className={'iconfont icon-left'} />
            </span>
          }
        />
        <PostItem
          type={PostType.post}
          postDto={post}
          isTop={true}
          more={
            <i className="iconfont icon-ellipsis" onClick={this.showDropDown} />
          }
        />
        <div className={style.followPosts}>
          <div className={style.top}>
            {post.followPostCount}
            条回复
          </div>
        </div>
        <div className={style.list}>
          <ul>
            {followPosts.map((o: FollowPostDto, i) => (
              <li key={i} onClick={this.showReplyInput.bind(this, o)}>
                <PostItem type={PostType.followPost} followPostDto={o} />
              </li>
            ))}
          </ul>
        </div>
        {isShowFollowPostInput ? (
          <NewPost
            onHide={this.handleFollowPostInputHide}
            onSend={this.handleFollowPostInputHide}
            type={PostType.followPost}
            postId={postId}
            initContent={
              currentItem ? `回复 ${currentItem.creator.userName}：` : ''
            }
          />
        ) : (
          ''
        )}
      </div>
    )
  }

  private showReplyInput = (o: FollowPostDto) => {
    this.setState({ currentItem: o })
    this.dispatch({
      type: 'followPost/setData',
      key: 'isShowFollowPostInput',
      val: true
    })
  }

  private handleFollowPostInputHide = () => {
    this.dispatch({
      type: 'followPost/setData',
      key: 'isShowFollowPostInput',
      val: false
    })
  }
  private showDropDown = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement
    const that = this
    dropDownList(
      [
        {
          label: '回复',
          callback() {
            that.dispatch({
              type: 'followPost/setData',
              key: 'isShowFollowPostInput',
              val: true
            })
          }
        }
      ],
      el,
      dropDownPosition.leftBottom
    )
  }
}

export default connect((state) => {
  return { ...state }
})(FollowPost)
