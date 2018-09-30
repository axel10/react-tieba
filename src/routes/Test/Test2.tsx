import { connect } from 'dva'
import React from 'react'
import { IBaseProps } from '../../mixin/IBaseProps'
import style from './Test2.scss'

class Test2 extends React.Component<IBaseProps> {
  private dispatch = this.props.dispatch

  public render() {
    return (
      <div className={'Test2'} style={{ height: '3000px' }}>
        test2asdf
      </div>
    )
  }
}

export default connect((state) => {
  return { ...state }
})(Test2)
