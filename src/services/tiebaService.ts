import request from '../utils/request'

export default {
  getTip(title) {
    return request.post('/Tieba/GetTip', { title })
  },
  create(title) {
    return request.post('/Tieba/create', { title })
  },
  getTiebaData(title) {
    return request.post('/Tieba/Get', { title })
  },
  follow(tiebaId: number) {
    return request.post('/Tieba/Follow', { tiebaId })
  },
  sign(tiebaId: number) {
    return request.post('/Tieba/Sign', { tiebaId })
  }
}
