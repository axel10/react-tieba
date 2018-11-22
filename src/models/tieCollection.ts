import { Model } from 'dva'
import history from '../history'
import { IAllState } from '..'
import postService from '../services/postService'
import userService from '../services/userService'
import { TieCollectionDto } from '../types/User/TieCollectionDto'

export interface ITieCollectionState {
  collections: TieCollectionDto[]
  pageSize: number
  pageNo: number
  isEnd: boolean
}

export interface IModel extends Model {
  state: ITieCollectionState
}

const TieCollectionModel: IModel = {
  namespace: 'tieCollection',

  state: {
    collections: [],
    pageSize: 6,
    pageNo: 1,
    isEnd: false
  },

  effects: {
    *getData(p, { call, put, select }) {
      const state = yield select((s: IAllState) => s.tieCollection)
      if (state.isEnd) return
      const data = yield call(userService.getTieCollection, {
        pageSize: state.pageSize,
        pageNo: state.pageNo
      })
      yield put({ type: 'addData', data })
    },
    *toTie({ i }, { put, call, select }) {
      const item: TieCollectionDto = yield select(
        (s: IAllState) => s.tieCollection.collections[i]
      )
      const pageSize = yield select((s: IAllState) => s.post.pageSize)
      const pageNo =
        item.type === 1
          ? 1
          : yield call(postService.getPageNo, { postId: item.postId, pageSize })
      const url =
        item.type === 1
          ? `/p/${item.threadId}`
          : `/p/${item.threadId}/${pageNo}/0/${item.postId}`
      history.push(url)
    }
  },

  reducers: {
    addData(state: ITieCollectionState, { data }) {
      state.collections = state.collections.concat(data)
      state.pageNo++
      if (data.length < state.pageSize) state.isEnd = true
      return { ...state }
    }
  }
}

export default TieCollectionModel
