import { MessageCountDto } from '../types/User/MessageCountDto'
import { CollectionPostType } from '../utils/enum/CollectionPostType'
import { MessageType } from '../utils/enum/MessageType'
import request from '../utils/request'

interface ITieCollectionOptions {
  type: CollectionPostType
  tieId: number
}

export interface IGetTiebaFollowOptions {
  pageSize: number
  pageNo: number
  isHasHeadImg?: boolean
  userName: string
}

export default {
  login({ username, password }) {
    return request.post('/user/login', { username, password })
  },
  logout() {
    return request.post('/user/Logout')
  },
  register(username, password) {
    return request.post('/user/register', { username, password })
  },
  checkIsLogin() {
    return request.post('/user/CheckIsLogin')
  },
  getTieCollection({ pageSize, pageNo }) {
    return request.post('/user/GetTieCollections', { pageSize, pageNo })
  },
  addTieCollection(opt: ITieCollectionOptions) {
    return request.post('/user/AddTieCollection', opt)
  },
  cancelTieCollection(opt: ITieCollectionOptions) {
    return request.post('/user/CancelTieCollection', opt)
  },
  getUserInfo() {
    return request.post('/user/GetUserInfo')
  },
  getHomeData(userName: number) {
    return request.post('/user/GetHomeData', { userName })
  },
  getDynamic(obj) {
    return request.post('/user/GetDynamic', { ...obj })
  },
  getTiebaFollow(opt) {
    return request.post('/user/GetTiebaFollow', opt)
  },
  getFansList(opt) {
    return request.post('/user/GetFansList', { ...opt })
  },
  getFollowList(opt) {
    return request.post('/user/GetFollowList', { ...opt })
  },
  follow(userName) {
    return request.post('/user/Follow', { userName })
  },
  cancelFollow(userName) {
    return request.post('/user/CancelFollow', { userName })
  },
  getEditUserData() {
    return request.get('/user/EditUserData')
  },
  editUserData(formData: FormData) {
    return request.formData('/user/EditUserData', formData)
  },
  userIsExist(userName) {
    return request.post('/user/UserIsExist', { userName })
  },
  getMessage(type: MessageType) {
    return request.post('/user/GetMessage', { type })
  },
  getUnknownMessageCount(): Promise<MessageCountDto> {
    return request.post('/user/GetUnknownMessageCount')
  },
  removeFollowTieba(tiebaId: number): Promise<boolean> {
    return request.post('/user/RemoveFollowTieba', { tiebaId })
  }
}
