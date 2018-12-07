import style from './Button.scss'
import * as React from 'react'

export default function Button ({children,...props}) {
  return (
    <div className={style.Button} onClick={props.onClick}>
      {children}
    </div>
  )
}
