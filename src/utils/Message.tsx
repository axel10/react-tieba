import React from 'react'
import ReactDOM from 'react-dom'
import Toast from '../components/Message/Toast'

export default {
  toast(title: string) {
    const div: HTMLDivElement = document.createElement('div')
    document.body.appendChild(div)
    ReactDOM.render(<Toast title={title} />, div)
    setTimeout(() => {
      document.body.removeChild(div)
    }, 3000)
  }
}
