import * as React from 'react'

import style from './Button.scss'

export default function Button ({ children,...props }) {
  return (
    <div className={style.Button} onClick={props.onClick}>
      {children}
    </div>
  )
}
