import { connect } from 'dva'
import React from 'react'
import { IBaseProps } from 'src/mixin/IBaseProps'
import style from './Pager.scss'

interface IProps extends IBaseProps {
  currentPage: number
  totalPage: number
  onJump(pageNo: number): void
}

class Pager extends React.Component<IProps> {
  public render() {
    const { currentPage, totalPage } = this.props
    return (
      <div className={style.Pager}>
        <div className={style.toPrev}>
          <i className="iconfont icon-prev" onClick={this.toPrev} />
        </div>
        <div className={style.count}>{`${currentPage}/${totalPage}`}</div>
        <div className={style.toNext}>
          <i className="iconfont icon-next" onClick={this.toNext} />
        </div>
      </div>
    )
  }
  private toPrev = () => {
    if (this.props.currentPage <= 1) return
    this.props.onJump(this.props.currentPage - 1)
  }

  private toNext = () => {
    if (this.props.currentPage >= this.props.totalPage) return
    this.props.onJump(this.props.currentPage + 1)
  }
}

export default connect((state) => {
  return { ...state }
})(Pager)
