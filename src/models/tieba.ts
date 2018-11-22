import { Model } from 'dva'
import * as _ from 'lodash'
import tiebaService from 'src/services/tiebaService'
import { IPageData } from 'src/types/Common/IPageData'
import { PageLoadAble } from 'src/types/Common/PageLoadAble'
import { TiebaDto } from 'src/types/Tieba/TiebaDto'
import { historyPush, showLoadingTip, toast } from 'src/utils/utils'
import { IAllState } from '..'
import postService from '../services/postService'
import { ThreadListDto } from '../types/Thread/ThreadListDto'
import { LevelInfo } from '../types/User/LevelInfo'

export interface ITiebaState {
  tiebaInfo: TiebaDto
  threads: PageLoadAble<ThreadListDto>
}

interface IModel extends Model {
  state: ITiebaState
}

const initState = {
  tiebaInfo: new TiebaDto(),
  threads: new PageLoadAble(5)
}

function initExperienceBar (levelInfo: LevelInfo) {
  setTimeout(() => {
    const experience: HTMLElement = document.querySelector('.experience')
    const hasExperience = experience.children[0] as HTMLElement
    const totalExperience = levelInfo.experience + levelInfo.nextLevelExperience
    hasExperience.style.width = `${(levelInfo.experience / totalExperience) *
    100}%`
  })
}

const tieba: IModel = {
  namespace: 'tieba',

  state: _.clone(initState) as ITiebaState,

  effects: {
    * create ({ params }, { put, call, select }) {
      // const state = yield select((s: IAllState) => s.tieba)
      const title = params.title
      try {
        const result = yield call(tiebaService.create, title)
        if (result) {
          window.location.reload()
        }
      } catch (e) {
        if (e.response.status === 499) {
          historyPush('/login')
        }
      }
    },
    * init (payload, { put, call, select }) {
      const state: ITiebaState = yield select((s: IAllState) => s.tieba)
      const title = state.tiebaInfo.title
      const data: TiebaDto = yield call(tiebaService.getTiebaData, title)

      if (data) {
        yield put({ type: 'setData', data: { tiebaInfo: data } })
        yield put({ type: 'setHasTieba', b: true })
        yield put({ type: 'jump', pageNo: 1 })
        if (data.levelInfo) {
          initExperienceBar(data.levelInfo)
        }
      } else {
        yield put({ type: 'setHasTieba', b: false })
      }

      return 'true'
    },
    // 页数跳转
    * jump ({ pageNo }, { put, call, select }) {
      const state: ITiebaState = yield select((s: IAllState) => s.tieba)
      // const done = showLoadingTip('正在加载')
      const data: IPageData = yield call(postService.getThread, {
        pageSize: state.threads.pageSize,
        pageNo,
        tiebaId: state.tiebaInfo.id
      })
      yield put({ type: 'setThread', threads: data.data, total: data.total })
      yield put({ type: 'setPageNo', pageNo })

      return new Promise((resolve => {
        resolve()
      }))
      // done('')
    },
    // 关注
    * follow (p, { put, call, select }) {
      const tiebaId = yield select((s: IAllState) => s.tieba.tiebaInfo.id)
      const tiebaDto: TiebaDto = yield call(tiebaService.follow, tiebaId)
      yield put({ type: 'setLevelInfo', levelInfo: tiebaDto.levelInfo })
      yield put({ type: 'setIsCanSign', b: tiebaDto.isCanSign })
      toast('关注成功！')
    },
    // 签到
    * sign (p, { put, call, select }) {
      const tiebaId = yield select((s: IAllState) => s.tieba.tiebaInfo.id)
      const levelInfo: LevelInfo = yield call(tiebaService.sign, tiebaId)
      yield put({ type: 'setLevelInfo', levelInfo })
      yield put({ type: 'setIsCanSign', b: false })
    }
  },

  reducers: {
    setTitle (state: ITiebaState, { title }) {
      state.tiebaInfo.title = title
      return { ...state }
    },
    setData (state: ITiebaState, { data }) {
      return { ...state, ...data }
    },
    setHasTieba (state: ITiebaState, { b }) {
      state.tiebaInfo.hasTieba = b
      return { ...state }
    },
    setThread (state: ITiebaState, { threads, total }) {
      state.threads.data = threads
      state.threads.itemCount = total
      return { ...state }
    },
    reset (state: ITiebaState) {
      state = _.clone(initState) as ITiebaState
      return { ...state }
    },
    setPageNo (state: ITiebaState, { pageNo }) {
      state.threads.pageNo = pageNo
      return { ...state }
    },
    setLevelInfo (state: ITiebaState, { levelInfo }) {
      state.tiebaInfo.levelInfo = levelInfo
      initExperienceBar(levelInfo)
      return { ...state }
    },
    setIsCanSign (state: ITiebaState, { b }) {
      state.tiebaInfo.isCanSign = b
      return { ...state }
    }
  }
}

export default tieba
