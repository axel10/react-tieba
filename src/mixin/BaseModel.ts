import { Model } from 'dva'

/*
export interface IBaseModelState {
}

export interface IModel extends Model {
  state: IBaseModelState
}
*/

class BaseModel implements Model {
  public namespace: string

  public state: {}

  public effects: {}

  public reducers: {}
}

export default BaseModel
