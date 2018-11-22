import React from 'react'
import ReactDOM from 'react-dom'
import { Toast } from 'src/utils/components/toast'

export default {
  toast(title: string) {
    const toast = Toast(title)
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  }
}
