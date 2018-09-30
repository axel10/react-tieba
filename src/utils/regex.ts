/*export function email (val: string) {
  const reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
  return reg.test(val)
}

export function phoneNumber (val: string) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  return reg.test(val)
}*/

export default {
  phoneNumber(val: string) {
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/
    return reg.test(val)
  },
  email(val: string) {
    const reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
    return reg.test(val)
  }
}
