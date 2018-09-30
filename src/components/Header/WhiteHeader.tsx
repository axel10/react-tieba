import { connect } from 'dva'
import React from 'react'
import { IBaseProps } from '../../mixin/IBaseProps'
import style from './WhiteHeader.scss'

interface IProps extends IBaseProps {
  left: any
  title: string
  right: any
}

class WhiteHeader extends React.Component<IProps> {
  private dispatch = this.props.dispatch

  public render() {
    const left = this.props.left
    const right = this.props.right
    const title = this.props.title
    return (
      <div className={style.Header}>
        {/*<div className="left"></div>*/}
        <span className={style.icon + ` ${style.left}`}>{left}</span>
        <h4 className={style.center}>{title}</h4>
        <span className={style.icon + ` ${style.right}`}>{right}</span>
        {/*<div className="right"></div>*/}
      </div>
    )
  }
}

export default connect((state) => {
  return { ...state }
})(WhiteHeader)
