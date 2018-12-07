import { Model } from 'dva'
import _ from 'lodash'
import PageResult from 'src/types/Common/PageResult'
import { CollectionPostType } from 'src/utils/enum/CollectionPostType'
import { getQueryStringParams, pack } from 'src/utils/utils'
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
  pageNo: number
  isSeeLz: boolean
  thread: ThreadDetailDto
  count: number
  isShowPostInput: boolean
  isShowFollowPostInput: boolean
  currentPostId: number
  justSeeLz: boolean
}

const initState: IPostState = {
  title: '',
  posts: [],
  pageSize: 20,
  pageNo: 1,
  isSeeLz: false,
  thread: new ThreadDetailDto(),
  count: 0,
  isShowPostInput: false,
  isShowFollowPostInput: false,
  currentPostId: null,
  justSeeLz: false
}

export interface IModel extends Model {
  state: IPostState
}

const PostModel: IModel = {
  namespace: 'post',

  state: _.clone(initState),
  effects: {
    * init ({ params }, { put, call, select }) {
      const { threadId } = params
      const pageNo = params.pageNo ? params.pageNo : 1
      const pageSize: IPostState = yield select(
        (s: IAllState) => s.post.pageSize
      )
      const thread = yield call(postService.getThreadDetail, threadId)
      const searchParams = getQueryStringParams()
      const isSeeLz = searchParams.isSeeLz === '1'
      const posts: IPageData = yield call(postService.getPosts, {
        pageSize,
        pageNo,
        threadId,
        isSeeLz
      })
      yield put({ type: 'setData', key: 'isSeeLz', val: isSeeLz })
      yield put({ type: 'setData', key: 'pageNo', val: pageNo })
      yield put({ type: 'setThread', thread })
      yield put({ type: 'setPosts', data: posts.data, count: posts.total })
    },
    /*    * getPosts ({ params }, { put, call, select }) {
          const pageNo = params.pageNo ? params.pageNo : 1
          const threadId = params.threadId
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
        },*/
    * addTieCollection ({ tType, tieId }, { put, call }) {
      yield call(userService.addTieCollection, { type: tType, tieId })
      Message.toast('收藏成功')
      yield put({ type: 'editTieCollection', tType, b: true, tieId })
    },
    * cancelTieCollection ({ tType, tieId }, { put, call }) {
      yield call(userService.cancelTieCollection, { type: tType, tieId })
      Message.toast('取消收藏成功')
      yield put({ type: 'editTieCollection', tType, b: false, tieId })
    },
    * justSeeLz (p, { call, put, select }) {
      const threadId = yield select((o: IAllState) => o.post.thread.id)
      const pageNo = yield select((o: IAllState) => o.post.pageNo)
      const pageSize = yield select((o: IAllState) => o.post.pageSize)
      const data: IPageData = yield call(postService.getPosts, {
        pageSize,
        pageNo,
        threadId,
        isSeeLz: true
      })
      yield put({ type: 'setPosts', data: data.data, count: data.total })
      yield put({ type: 'setData', key: 'isSeeLz', val: true })
    },
    * cancelJustSeeLz (p, { call, put, select }) {
      const pageSize = yield select((o): IAllState => o.post.pageSize)
      const pageNo = yield select((o): IAllState => o.post.pageNo)
      const threadId = yield select((o): IAllState => o.post.threadId)
      const posts: IPageData = yield call(postService.getPosts, {
        pageSize,
        pageNo,
        threadId,
        isSeeLz: false
      })
      yield put({ type: 'setPosts', data: posts.data, count: posts.total })
      yield put({ type: 'setData', key: 'isSeeLz', val: false })
    }
  },

  reducers: {
    editTieCollection (state: IPostState, { tType, b, tieId }) {
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
    setThread (state: IPostState, { thread }) {
      state.thread = thread
      return { ...state }
    },
    setPosts (state: IPostState, { data, count }) {
      state.posts = data
      state.count = count
      return { ...state }
    },
    setData (state: IPostState, { key, val }) {
      state[key] = val
      return { ...state }
    },
    setPageNo (state: IPostState, { pageNo }) {
      state.pageNo = pageNo
      return { ...state }
    },
    addFollowPost (state: IPostState, { followPost, postId }) {
      const post = state.posts.find((o) => o.id === postId)
      if (!post) return { ...state }
      post.followPosts.push(followPost)
      post.followPostCount++
      return { ...state }
    },

    clearPosts () {
      return { ...(_.clone(initState)) }
    }
  }
}

export default pack(PostModel)
