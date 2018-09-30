import { connect } from 'dva'
import React from 'react'
import { IBaseProps } from '../../mixin/IBaseProps'
import style from './Test1.scss'

class Test1 extends React.Component<IBaseProps> {
  private dispatch = this.props.dispatch

  public render() {
    return <div className={'Test1'}>test1</div>
  }
}

export default connect((state) => {
  return { ...state }
})(Test1)
