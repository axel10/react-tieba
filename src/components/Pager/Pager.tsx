import { connect } from 'dva'
import React from 'react'
import { IBaseProps } from 'src/mixin/IBaseProps'
import style from './Pager.scss'

interface IProps extends IBaseProps {
  currentPage: string
  totalPage: string

  onJump (pageNo: number): void
}

class Pager extends React.Component<IProps> {
  public render () {
    const { currentPage, totalPage } = this.props
    return (
      <div className={style.Pager}>
        <div className={style.toPrev}>
          <i className='iconfont icon-prev' onClick={this.toPrev}/>
        </div>
        <div className={style.count}>{`${currentPage}/${totalPage}`}</div>
        <div className={style.toNext}>
          <i className='iconfont icon-next' onClick={this.toNext}/>
        </div>
      </div>
    )
  }

  private toPrev = () => {
    const currentPage = parseInt(this.props.currentPage,10)
    if (currentPage <= 1) return
    this.props.onJump(currentPage - 1)
  }

  private toNext = () => {
    const currentPage = parseInt(this.props.currentPage,10)
    const totalPage = parseInt(this.props.totalPage, 10)
    if (currentPage >= totalPage) return
    this.props.onJump(currentPage + 1)
  }

}

export default connect((state) => {
  return { ...state }
})(Pager)
