import { connect } from 'dva'
import React from 'react'
import history from 'src/history'
import { IBaseProps } from 'src/mixin/IBaseProps'
import userService from 'src/services/userService'
import { FollowPostDto } from 'src/types/Post/FollowPostDto'
import { PostDto } from 'src/types/Post/PostDto'
import { ThreadDetailDto } from 'src/types/Thread/ThreadDetailDto'
import { UserListDto } from 'src/types/User/UserListDto'
import { PostType } from 'src/utils/enum/PostType'
import { dropDownList, dropDownPosition, historyPush } from 'src/utils/utils'
import style from './PostItem.scss'

interface IProps extends IBaseProps {
  postDto?: PostDto
  followPostDto?: FollowPostDto
  threadDto?: ThreadDetailDto
  type: PostType
  isTop?: boolean
  more: any
}

class PostItem extends React.Component<IProps> {
  private dispatch = this.props.dispatch

  public constructor(props) {
    super(props)
    ;(window as any).toHome = (userName: string) => {
      userService.userIsExist(userName).then((o) => {
        if (o) {
          historyPush(`/home/${userName}`)
        }
      })
    }
  }

  public render() {
    let creator: UserListDto
    let content
    let followPosts
    let createTimeStr
    let followPostCount
    const isTop = this.props.isTop == null ? false : this.props.isTop
    const postDto = this.props.postDto
    const followPostDto = this.props.followPostDto
    const threadDto = this.props.threadDto
    switch (this.props.type) {
      case PostType.post:
        creator = postDto.creator
        content = postDto.content
          ? postDto.content.replace(
              /@([\u4e00-\u9fa5_a-zA-Z0-9]+)/g,
              `<span onclick="toHome('$1')">@$1</span>`
            )
          : ''
        followPosts = postDto.followPosts
        createTimeStr = postDto.createTimeStr
        followPostCount = postDto.followPostCount
        break
      case PostType.followPost:
        creator = followPostDto.creator
        content = followPostDto.content
          ? followPostDto.content.replace(
              /@([\u4e00-\u9fa5_a-zA-Z0-9]+)/g,
              `<span onclick="toHome('$1')">@$1</span>`
            )
          : ''
        createTimeStr = followPostDto.createTimeStr
        break
      case PostType.thread:
        creator = threadDto.creator
        content = threadDto.content
          ? threadDto.content.replace(
              /@([\u4e00-\u9fa5_a-zA-Z0-9]+)/g,
              `<span onclick="toHome('$1')">@$1</span>`
            )
          : ''
        createTimeStr = threadDto.createTimeStr
    }
    return (
      <div className={style.PostItem}>
        <div className={style.post}>
          <div className={style.postTop}>
            <div
              className={style.headImg}
              style={{
                backgroundImage: creator.headImg
                  ? `url(${creator.headImg})`
                  : ''
              }}
              onClick={historyPush.bind(this, `/home/${creator.userName}`)}
            />

            <div className={style.center}>
              <p className={style.name}>
                {creator.userName}
                <span className={style.level}>{creator.level}</span>
              </p>
              <p className={style.time}>{createTimeStr}</p>
            </div>
            {this.props.more}
          </div>

          <div className={isTop ? style.topContent : style.postContent}>
            <div className={style.content}>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
            {followPosts && followPosts.length ? (
              <div className={style.followPosts}>
                <ul>
                  {followPosts.map((follow: FollowPostDto, i) => (
                    <li key={i}>
                      <span className={style.user}>
                        {follow.creator.userName}
                      </span>
                      <span className={style.content}>{follow.content}</span>
                    </li>
                  ))}
                  {followPostCount > 2 ? (
                    <li onClick={this.toMoreFollowPost}>
                      查看所有
                      {followPostCount}
                      条回帖
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    )
  }

  /*  private showPostDropDown = (e) => {
    const id = this.props.postDto ? this.props.postDto.id : this.props.followPostDto.id
    this.dispatch({ type: 'post/setData', key: 'currentPostId', val: id })
    const that = this
    const el = e.currentTarget as HTMLElement
    setTimeout(() => {
      dropDownList([{
        label: '回复', callback () {
          that.dispatch({ type: 'post/setData', key: 'isShowFollowPostInput', val: true })
        }
      }], el, dropDownPosition.leftBottom)
    })
  }
  private handlePostInputShow = () => {
    this.dispatch({ type: 'post/setData', key: 'isShowPostInput', val: true })
  }
  private showThreadDropDown = () => {
  }
  private showFollowPostDropDown = (e) => {
    const that = this
    const el = e.currentTarget as HTMLElement
    dropDownList([{
      label: '回复', callback () {
        that.dispatch({ type: 'followPost/setData', key: 'isShowFollowPostInput', val: true })
      }
    }], el, dropDownPosition.leftBottom)
  }*/
  private toMoreFollowPost = () => {
    history.push(`/t/p/${this.props.postDto.id}`)
  }
}

export default connect((state) => {
  return { ...state }
})(PostItem)
