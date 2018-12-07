import { connect } from 'dva'
import React from 'react'
import { IBaseProps } from '../../mixin/IBaseProps'
import style from './Recommend.scss'

class Recommend extends React.Component<IBaseProps> {

  public render() {
    return (
      <div className={style.Recommend}>
        <div className={style.img}>
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537691947494&di=ded7968b56c97faf4e46cf7460b5b54a&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%253D580%2Fsign%3Dcd1e69e3818ba61edfeec827713497cc%2F343f44cad1c8a786b53c25276409c93d70cf50a1.jpg"
            alt=""
          />
        </div>
        <span className={style.tip}>推荐功能还在开发中，尽请期待</span>
      </div>
    )
  }
}

export default connect((state) => {
  return { ...state }
})(Recommend)
