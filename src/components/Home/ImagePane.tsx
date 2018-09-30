import { connect } from 'dva'
import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { IBaseProps } from 'src/mixin/IBaseProps'
import style from './ImagePane.scss'

interface IProps extends IBaseProps {
  imgUrl: string
  isShow: boolean
  onHide(): void
}

interface IState {
  isShow: boolean
}

class ImagePane extends React.Component<IProps, IState> {
  public state: IState = {
    isShow: false
  }

  constructor(props) {
    super(props)
  }

  public componentDidUpdate(preProps: IProps) {
    console.log(this.props)
    if (preProps.isShow === this.props.isShow) return
    this.setState({ isShow: this.props.isShow })
  }

  public render() {
    const imgUrl = this.props.imgUrl
    const isShow = this.state.isShow
    return (
      <div>
        <CSSTransition
          in={isShow}
          classNames={'image-pane'}
          timeout={{ exit: 300, enter: 0 }}
          unmountOnExit={true}
          appear={true}
        >
          <div className={style.ImagePane} onClick={this.hide}>
            <div className={style.img}>
              <img src={imgUrl} alt="" />
            </div>
          </div>
        </CSSTransition>
      </div>
    )
  }

  private hide = () => {
    if (typeof this.props.onHide === 'function') {
      this.props.onHide()
    }
    this.setState({ isShow: false })
  }
}

export default connect((state) => {
  return { ...state }
})(ImagePane)
