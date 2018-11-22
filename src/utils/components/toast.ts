
export function Toast (tip: string) {
  const tipEl: HTMLElement = document.createElement('div')
  tipEl.innerHTML = tip
  tipEl.className = 'g-toast'
  document.body.appendChild(tipEl)
  tipEl.style.opacity = '1'

/*  setTimeout(() => {
    tipEl.style.opacity = '1'
  },50)*/

  return tipEl
}
