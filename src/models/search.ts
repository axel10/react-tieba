import { Model } from 'dva'
import * as _ from 'lodash'
import TiebarService from '../services/tiebaService'
import { TiebaTitleTip } from '../types/Tieba/TiebaTitleTip'

export interface ISearchState {
  // histories: SearchHistory[]
  histories: string[]
  tips: TiebaTitleTip[]
}

export interface IModel extends Model {
  state: ISearchState
}

const initState = {
  histories: [],
  tips: []
}

const search: IModel = {
  namespace: 'search',

  state: {
    histories: [],
    tips: []
  },

  effects: {
    *fetchTips({ title }, { put, call }) {
      const tips = yield call(TiebarService.getTip, title)
      yield put({ type: 'setTips', tips })
    },
    *init(p, { put }) {
      const history = localStorage.getItem('search_history')
      if (history) {
        yield put({
          type: 'setData',
          key: 'histories',
          val: JSON.parse(history)
        })
      }
    }
  },

  reducers: {
    setTips(state: ISearchState, { tips }) {
      state.tips = tips
      return { ...state }
    },
    addHistory(state: ISearchState, { history }) {
      state.histories.unshift(history)
      localStorage.setItem('search_history', JSON.stringify(state.histories))
      return { ...state }
    },
    setData(state: ISearchState, { key, val }) {
      state[key] = val
      return { ...state }
    },
    reset(state: ISearchState) {
      state = _.clone(initState)
      return { ...state }
    }
  }
}

export default search
