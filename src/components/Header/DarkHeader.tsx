import { connect } from 'dva'
import React from 'react'
import * as router from 'react-router-redux'
import history from '../../history'
import { IBaseProps } from '../../mixin/IBaseProps'
import style from './DarkHeader.scss'

interface IProps extends IBaseProps {
  title: string
  right: any
}

class DarkHeader extends React.Component<IProps> {
  private dispatch = this.props.dispatch

  public render() {
    return (
      <div className={style.DarkHeader}>
        <div className={style.back} onClick={this.back}>
          <i className={'iconfont icon-left'} />
          <i className={'iconfont icon-tieba'} />
        </div>
        <div className={style.title}>{this.props.title}</div>
        <div className={style.right}>{this.props.right}</div>
      </div>
    )
  }

  private back() {
    history.goBack()
  }
}

export default connect((state) => {
  return { ...state }
})(DarkHeader)
