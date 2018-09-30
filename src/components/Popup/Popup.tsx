import { connect } from 'dva'
import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { IBaseProps } from 'src/mixin/IBaseProps'
import style from './Popup.scss'

export interface IPopupItem {
  icon: any
  label: string
  callback(): void
}

interface IState {
  mainIsShow: boolean
}

export interface IProps extends IBaseProps {
  items: IPopupItem[]
  isShow: boolean
  onHide(): void
}

class Popup extends React.Component<IProps, IState> {
  public state: IState = {
    mainIsShow: false
  }
  private dispatch = this.props.dispatch

  /*
  public componentDidMount () {
    this.setState({ isShow: this.props.isShow })
  }
*/

  public componentDidUpdate() {
    if (this.props.isShow !== this.state.mainIsShow) {
      setTimeout(() => {
        this.setState({ mainIsShow: this.props.isShow })
      }, 10)
    }
  }

  public render() {
    const items = this.props.items
    const isShow = this.props.isShow
    const mainIsShow = this.state.mainIsShow
    return (
      <CSSTransition
        classNames={'popup-wrap'}
        timeout={{ enter: 0, exit: 300 }}
        unmountOnExit={true}
        in={isShow}
      >
        <div className={style.Popup} onClick={this.hide}>
          <CSSTransition
            classNames={'popup-main'}
            timeout={{ enter: 0, exit: 300 }}
            unmountOnExit={true}
            in={mainIsShow}
          >
            <div className={style.main}>
              <ul>
                {items.map((o, i) => (
                  <li key={i} onClick={this.exec.bind(this, o)}>
                    <p className={style.icon}>{o.icon}</p>
                    <p className={style.label}>{o.label}</p>
                  </li>
                ))}
              </ul>
              <div className={style.cancel} onClick={this.hide}>
                <p>取消</p>
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    )
  }
  private hide = () => {
    if (typeof this.props.onHide === 'function') {
      this.props.onHide()
    }
  }
  private exec = (o: IPopupItem) => {
    if (typeof this.props.onHide === 'function') {
      this.props.onHide()
    }
    o.callback()
  }
}

export default connect((state) => {
  return { ...state }
})(Popup)
