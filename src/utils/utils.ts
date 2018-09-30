import React from 'react'
import history from '../history'

export function clone(o: object) {
  return JSON.parse(JSON.stringify(o))
}

export const isInSelf = (node: HTMLElement, className: string): boolean => {
  if (node === document.body) {
    return false
  }
  if (node.className.indexOf(className) !== -1) {
    return true
  }
  if (node.parentNode) {
    return isInSelf(node.parentNode as HTMLElement, className)
  } else {
    return false
  }
}

export class GetOffset {
  public static top(obj: HTMLElement) {
    return (
      obj.offsetTop +
      (obj.offsetParent ? this.top(obj.offsetParent as HTMLElement) : 0)
    )
  }

  public static left(obj: HTMLElement) {
    return (
      obj.offsetLeft +
      (obj.offsetParent ? this.left(obj.offsetParent as HTMLElement) : 0)
    )
  }
}

export function triggerClick(selector: string) {
  const e = document.createEvent('MouseEvents')
  e.initEvent('click', true, true)
  const el = document.querySelector(selector)
  el.dispatchEvent(e)
}

export function goBack() {
  history.goBack()
}

export function getTotalPage(pageSize: number, count: number): number {
  return count / pageSize < 1 ? 1 : Math.ceil(count / pageSize)
}

export interface IDropDownOption {
  label: string

  callback(): void
}

export function offsetTop(obj: HTMLElement) {
  return (
    obj.offsetTop +
    (obj.offsetParent ? offsetTop(obj.offsetParent as HTMLElement) : 0)
  )
}

export function offsetLeft(obj: HTMLElement) {
  return (
    obj.offsetLeft +
    (obj.offsetParent ? offsetLeft(obj.offsetParent as HTMLElement) : 0)
  )
}

export enum dropDownPosition {
  rightBottom = 'right-bottom',
  leftBottom = 'left-bottom'
}

/*
switch (position) {
  case 'right-bottom':
    container.style.left = elOffsetLeft + 'px'
    container.style.top = elOffsetTop + el.offsetHeight + 'px'
    checkRight()
    if (container.offsetHeight + container.offsetTop > screenH) {
      container.style.top = elOffsetTop - container.offsetHeight + 'px'
    }
    break
  case 'left-bottom':

*/

export function dropDownList(
  options: IDropDownOption[],
  el: HTMLElement,
  position: string
) {
  const container = document.createElement('div') as HTMLElement
  container.className = 'g-dropdown'
  const ul = document.createElement('ul') as HTMLElement
  options.forEach((o, i) => {
    const li = document.createElement('li') as HTMLElement
    li.innerHTML = o.label
    li.onclick = o.callback
    ul.appendChild(li)
  })
  container.appendChild(ul)
  document.body.appendChild(container)

  function removeDropDown() {
    /*    if (!isInSelf(e.target,'g-dropdown')) {
          e.stopPropagation()
        }*/
    document.body.removeChild(container)
    document.body.removeEventListener('click', removeDropDown)
  }

  document.body.addEventListener('click', removeDropDown)

  setTimeout(() => {
    const screenW = document.body.clientWidth
    const screenH = document.body.clientHeight

    function checkRight() {
      if (screenW < container.offsetLeft + container.offsetWidth) {
        container.style.left = 'auto'
        container.style.right = '0px'
      }
    }

    function checkBottom() {
      if (screenH < container.offsetTop + container.offsetHeight) {
        container.style.top = 'auto'
        container.style.bottom = '0px'
      }
    }

    const elOffsetLeft = offsetLeft(el)
    const elOffsetTop = offsetTop(el)
    switch (position) {
      case dropDownPosition.rightBottom:
        container.style.left = elOffsetLeft + 'px'
        container.style.top = elOffsetTop + el.offsetHeight + 'px'
        checkRight()
        if (container.offsetHeight + container.offsetTop > screenH) {
          container.style.top = elOffsetTop - container.offsetHeight + 'px'
        }
        break
      case dropDownPosition.leftBottom:
        const distance: number = container.offsetWidth - el.offsetWidth
        container.style.left = elOffsetLeft - distance + 'px'
        container.style.top = elOffsetTop + el.offsetHeight + 'px'
        checkRight()
        if (container.offsetHeight + container.offsetTop > screenH) {
          container.style.top = elOffsetTop - container.offsetHeight + 'px'
        }
        break
    }
  })
}

/**
 * 传递事件对象，返回 {dom元素的name:相应的value} 对象
 * @param e
 */
export function getBindFieldObj(e: React.FormEvent) {
  const el = e.currentTarget as HTMLInputElement
  const key = el.name
  let obj
  switch (el.tagName.toLowerCase()) {
    case 'textarea':
      obj = { [key]: el.value }
      break
    case 'input':
      switch (el.type) {
        case 'text':
        case 'password':
          obj = { [key]: el.value }
          break
        case 'number':
          obj = { [key]: parseInt(el.value, 10) }
          break
        case 'file':
          obj = el.multiple ? { [key]: el.files } : { [key]: el.files[0] }
          break
        case 'radio':
          obj = /^\w+$/.test(el.value)
            ? { [key]: parseInt(el.value, 10) }
            : { [key]: el.value }
          break
        case 'checkbox':
          obj = { [key]: el.checked }
          break
        default:
          break
      }
  }
  return obj
}

export function historyPush(url) {
  history.push(url)
}

export function historyGoBack() {
  history.goBack()
}

export function arrGroup(arr, size) {
  const res = []
  let tmp = []
  for (let i = 0; i < arr.length; i++) {
    tmp.push(arr[i])
    if (tmp.length === size) {
      res.push(tmp)
      tmp = []
      if (i + size >= arr.length) {
        const rest = arr.slice(++i, arr.length)
        if (rest.length > 0) {
          res.push(rest)
        }
        break
      }
    }
  }
  return res
}

export function numberToStr(num: number) {
  if (num < 10000) {
    return num
  } else {
    return Math.floor(num / 10000) + 'w'
  }
}
