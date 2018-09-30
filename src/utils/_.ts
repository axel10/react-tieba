export default {
  clone(obj: object) {
    return JSON.parse(JSON.stringify(obj))
  }
}
