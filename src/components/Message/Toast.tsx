import React from 'react'
import style from './Toast.scss'

interface IProps {
  title: string
}

class Toast extends React.Component<IProps> {
  public render() {
    return <div className={style.Toast}>{this.props.title}</div>
  }
}

export default Toast
