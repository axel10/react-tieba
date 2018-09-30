import { History, Location } from 'history'
import { match } from 'react-router'
import { Dispatch } from 'redux'

export interface IBaseProps {
  dispatch: Dispatch
  history: History
  match: match<any>
  location: Location
}
