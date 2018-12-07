import { Model } from 'dva'
import { IIndexState } from 'src/models'

export class BaseModel {
  public reducers: any = {}
  constructor () {
    this.reducers.setData = (state: any,{ key,val }) => {
      state[key] = val
      return { ...state }
    }
  }
}
