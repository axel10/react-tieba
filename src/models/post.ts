import { Model } from 'dva'
import { CollectionPostType } from 'src/utils/enum/CollectionPostType'
import { IAllState } from '..'
import postService from '../services/postService'
import userService from '../services/userService'
import { IPageData } from '../types/Common/IPageData'
import { PostDto } from '../types/Post/PostDto'
import { ThreadDetailDto } from '../types/Thread/ThreadDetailDto'
import Message from '../utils/Message'

export interface IPostState {
  title: string
  posts: PostDto[]
  pageSize: number
  isSeeLz: boolean
  thread: ThreadDetailDto
  count: number

  isShowPostInput: boolean
  isShowFollowPostInput: boolean
  currentPostId: number
}

export interface IModel extends Model {
  state: IPostState
}

const PostModel: IModel = {
  namespace: 'post',

  state: {
    title: '',
    posts: [],
    pageSize: 20,
    isSeeLz: false,
    thread: new ThreadDetailDto(),
    count: 0,

    isShowPostInput: false,
    isShowFollowPostInput: false,
    currentPostId: null
  },
  effects: {
    *init({ params }, { put, call, select }) {
      const threadId = params.threadId
      const pageSize: IPostState = yield select(
        (s: IAllState) => s.post.pageSize
      )
      const thread = yield call(postService.getThreadDetail, threadId)
      const isSeeLz = params.isSeeLz === '1'
      const pageNo = params.pageNo ? params.pageNo : 1
      const posts: IPageData = yield call(postService.getPosts, {
        pageSize,
        pageNo,
        threadId,
        isSeeLz
      })
      yield put({ type: 'setThread', thread })
      yield put({ type: 'setPosts', data: posts.data, count: posts.total })
      const postId = params.postId
      // console.log(document.querySelector(`li[data-postid="${postId}"]`))
      if (postId) {
        try {
          ;(document
            .querySelector(`li[data-postid="${postId}"]`)
            .querySelector('.content') as HTMLElement).style.fontWeight = '700'
        } catch (e) {
          console.log(e)
        }
      }
    },
    *getPosts({ params }, { put, call, select }) {
      const pageNo = params.pageNo ? params.pageNo : 1
      const threadId = params.threadId
      // yield put({ type: 'setPageNo',pageNo })
      const pageSize: IPostState = yield select(
        (s: IAllState) => s.post.pageSize
      )
      const isSeeLz = params.isSeeLz === '1'
      const posts: IPageData = yield call(postService.getPosts, {
        pageNo,
        pageSize,
        threadId,
        isSeeLz
      })
      yield put({ type: 'setPosts', data: posts.data, count: posts.total })
    },
    *addTieCollection({ tType, tieId }, { put, call }) {
      yield call(userService.addTieCollection, { type: tType, tieId })
      Message.toast('收藏成功')
      yield put({ type: 'editTieCollection', tType, b: true, tieId })
    },
    *cancelTieCollection({ tType, tieId }, { put, call }) {
      yield call(userService.cancelTieCollection, { type: tType, tieId })
      Message.toast('取消收藏成功')
      yield put({ type: 'editTieCollection', tType, b: false, tieId })
    }
  },

  reducers: {
    editTieCollection(state: IPostState, { tType, b, tieId }) {
      switch (tType) {
        case CollectionPostType.Thread:
          state.thread.isCollected = b
          break
        case CollectionPostType.Post:
          const res = state.posts.find((o) => o.id === tieId)
          if (res) {
            res.isCollected = b
          }
      }
      return { ...state }
    },
    setThread(state: IPostState, { thread }) {
      state.thread = thread
      return { ...state }
    },
    setPosts(state: IPostState, { data, count }) {
      state.posts = data
      state.count = count
      return { ...state }
    },
    setData(state: IPostState, { key, val }) {
      state[key] = val
      return { ...state }
    },
    /*    setPageNo (state: IPostState, { pageNo }) {
          state.readOptions.pageNo = pageNo
          return { ...state }
        }*/
    addFollowPost(state: IPostState, { followPost, postId }) {
      const post = state.posts.find((o) => o.id === postId)
      if (!post) return { ...state }
      post.followPosts.push(followPost)
      post.followPostCount++
      return { ...state }
    }
  }
}

export default PostModel
