import { connect } from 'dva'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { IPostState } from 'src/models/post'
import { PostType } from 'src/utils/enum/PostType'
import { getTotalPage, showLoadingTip, toast, triggerClick } from 'src/utils/utils'
import WhiteHeader from '../../components/Header/WhiteHeader'
import history from '../../history'
import postService from '../../services/postService'
import Message from '../../utils/Message'
import style from './NewPost.scss'
import { ICommonState } from 'src/models/common'

interface IState {
  title: string
  content: string
  files: File[]
  thumbs: any[]
}

interface IProps extends IBaseProps {
  type?: PostType
  post: IPostState
  postId?: number
  initContent: string
  common:ICommonState
  onSend (): void
  onHide (): void
}

class NewPost extends React.Component<IProps, IState> {
  public state: IState = {
    title: '',
    content: '',
    files: [],
    thumbs: []
  }

/*
  componentDidMount () {
    setTimeout(()=>{
      const {isLogin} = this.props.common
      if (!isLogin) {
        toast('请先登录')
        history.push('/login')
      }
    },600)
  }
*/


  constructor (props) {
    super(props)

  }


  private dispatch = this.props.dispatch
  private contentInput: HTMLTextAreaElement

  public render () {
    const thumbs = this.state.thumbs
    let type = this.props.type
    if (!type) {
      type = PostType.thread
    }
    const initContent = this.props.initContent

    return (
      <div className={style.NewPost}>
        <WhiteHeader
          title={'编辑帖子'}
          left={
            <span onClick={this.goBack}>
              <i className={'iconfont icon-left'}/>
            </span>
          }
          right={<span onClick={this.submit}>发布</span>}
        />
        <div className={style.main}>
          <div className={style.editor}>
            {type === PostType.thread ? (
              <div className={style.title}>
                <input
                  type='text'
                  name={'title'}
                  placeholder='加个标题哟~'
                  onInput={this.bindField}
                />
              </div>
            ) : (
              ''
            )}
            <div className={style.content}>
              <textarea
                name='content'
                onInput={this.bindField}
                placeholder='在这里输入内容'
                defaultValue={initContent}
                ref={(o) => {
                  this.contentInput = o
                }}
              />
            </div>

            <div className={style.footer}>
              <div className={style.tools}>
                <ul>
                  {type === PostType.followPost ? (
                    ''
                  ) : (
                    <li onClick={this.triggerSelectFile}>
                      <i className='iconfont icon-image'/>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className={style.imgs}>
              <ul>
                {thumbs.map((o, i) => {
                  return (
                    <li key={i} style={{ backgroundImage: `url('${o}')` }}>
                      <div
                        className={style.close}
                        onClick={this.removeImg.bind(this, i)}
                      >
                        <i className='iconfont icon-close'/>
                      </div>
                    </li>
                  )
                })}
                <li className={style.add}/>
              </ul>
            </div>
            <input
              type='file'
              style={{ display: 'none' }}
              id='files'
              onInput={this.handleSelectFile}
            />
          </div>
        </div>
      </div>
    )
  }

  private goBack = () => {
    if (!this.props.type || this.props.type === PostType.thread) {
      history.goBack()
    } else {
      this.props.onHide()
    }
  }
  private handleSelectFile = (e: React.FormEvent) => {
    const el = e.currentTarget as HTMLInputElement
    const files = this.state.files.concat(el.files.item(0))
    this.setState({ files })
    const thumbs = this.state.thumbs
    const that = this
    const reader = new FileReader()
    reader.onloadend = () => {
      that.setState({ thumbs: thumbs.concat(reader.result) })
    }
    reader.readAsDataURL(el.files.item(0))
  }
  private bindField = (e: React.FormEvent) => {
    const el = e.currentTarget as HTMLInputElement
    const key = el.name
    const val = el.value
    const obj = {}
    obj[key] = val
    this.setState(obj)
  }
  private triggerSelectFile = () => {
    triggerClick('#files')
  }
  private removeImg = (i) => {
    this.setState({
      files: this.state.files.filter((o, index) => index !== i),
      thumbs: this.state.thumbs.filter((o, index) => index !== i)
    })
  }
  private submit = () => {
    this.setState({ content: this.contentInput.value })
    console.log(this.contentInput.value)

    setTimeout(() => {
      const state = this.state
      const type = this.props.type

      if (state.title.length === 0 && type === PostType.thread) {
        Message.toast('标题不能为空')
        return
      }

      if (state.content.length === 0) {
        Message.toast('内容不能为空')
        return
      }
      const tiebaTitle = this.props.match.params.tieba
      const formData = new FormData()
      this.state.files.forEach((o) => {
        formData.append('files', o)
      })

      if (!type || type === PostType.thread) {
        formData.append('TiebaTitle', tiebaTitle)
        formData.append('Content', this.state.content)
        formData.append('Title', this.state.title)
        const done = showLoadingTip('正在发帖')
        postService.createThread(formData).then((res) => {
          if (res) {
            this.dispatch({ type: 'tieba/jump', pageNo: 1 })
            history.push(`/tieba/${tiebaTitle}`)
            done('发帖成功')
          }
        })
      }
      if (type === PostType.post) {
        formData.append('content', this.state.content)
        formData.append('threadId', this.props.match.params.threadId)
        const done = showLoadingTip('正在发帖')
        postService.createPost(formData).then((o) => {
          if (o) {
            const post = this.props.post
            const params = this.props.match.params
            const totalPage = getTotalPage(post.pageSize, post.count)
            history.push(`/p/${params.threadId}/${totalPage}`)
            this.dispatch({ type: 'post/getPosts', params })
            this.props.onSend()
            done()
          }
        })
      }
      if (type === PostType.followPost) {
        if (!this.props.postId) throw new Error('类型为跟帖时必须传递帖子id')
        const done = showLoadingTip('正在发帖')
        postService
          .createFollowPost(this.state.content, this.props.postId)
          .then((followPost) => {
            if (followPost) {
              // Message.toast('跟帖发送成功！')
              done()
              this.dispatch({
                type: 'post/addFollowPost',
                followPost,
                postId: this.props.postId
              })
              this.dispatch({
                type: 'followPost/addFollowPosts',
                followPosts: [followPost]
              })
              this.props.onSend()
            }
          })
      }
    })
  }
}

export default connect((state) => {
  return { ...state }
})(withRouter(NewPost))
