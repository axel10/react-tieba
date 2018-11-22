import { Model } from 'dva'
import { clone } from 'src/utils/utils'
import { IAllState } from '..'
import postService from '../services/postService'
import { FollowPostDto } from '../types/Post/FollowPostDto'
import { PostDto } from '../types/Post/PostDto'

export interface IFollowPostState {
  post: PostDto
  followPosts: FollowPostDto[]
  isShowFollowPostInput: boolean
  pageSize: number
  pageNo: number
}

const initState: IFollowPostState = {
  followPosts: [],
  isShowFollowPostInput: false,
  pageSize: 6,
  pageNo: 1,
  post: new PostDto()
}

export interface IModel extends Model {
  state: IFollowPostState
}

const FollowPostModel: IModel = {
  namespace: 'followPost',

  state: clone(initState),

  effects: {
    *init({ params }, { put, call, select }) {
      const state: IFollowPostState = yield select(
        (s: IAllState) => s.followPost
      )
      const postId = params.postId
      const pageNo = state.pageNo
      const pageSize = state.pageSize
      const followPosts = yield call(postService.getFollowPosts, {
        pageNo,
        pageSize,
        postId
      })
      const post = yield call(postService.getPostDetail, postId)
      yield put({ type: 'setData', key: 'post', val: post })
      yield put({ type: 'addFollowPosts', followPosts })
    },
    *getFollowPost({ params }, { call, put, select }) {
      const state: IFollowPostState = yield select(
        (s: IAllState) => s.followPost
      )
      const postId = params.postId
      yield put({ type: 'addPgeNo' })
      const pageNo = state.pageNo
      const pageSize = state.pageSize
      const followPosts = yield call(postService.getFollowPosts, {
        pageNo,
        pageSize,
        postId
      })
      yield put({ type: 'addFollowPosts', followPosts })
    }
  },

  reducers: {
    setData(state: IFollowPostState, { key, val }) {
      state[key] = val
      return { ...state }
    },
    addFollowPosts(state: IFollowPostState, { followPosts }) {
      state.followPosts = state.followPosts.concat(followPosts)
      return { ...state }
    },
    addPageNo(state: IFollowPostState) {
      state.pageNo++
      return { ...state }
    },
    reset(state: IFollowPostState) {
      state = clone(initState)
      return { ...state }
    }
  }
}

export default FollowPostModel
