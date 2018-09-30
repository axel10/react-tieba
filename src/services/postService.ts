import request from '../utils/request'

export default {
  createThread(formData: FormData) {
    return request.formData('Post/CreateThread', formData)
  },
  getThread(options: IGetThreadOptions) {
    return request.post('/post/GetThreads', options)
  },
  getPosts(options: IGetPostOptions) {
    return request.post('/post/GetPosts', options)
  },
  getThreadDetail(threadId: number) {
    return request.post('/post/GetThreadDetail', { threadId })
  },
  getPostDetail(postId: number) {
    return request.post('/post/GetPostDetail', { postId })
  },
  getFollowPosts(options: IGetFollowPostOptions) {
    return request.post('/post/GetFollowPost', options)
  },
  createPost(formData: FormData) {
    return request.formData('/post/CreatePost', formData)
  },
  createFollowPost(content: string, postId: number) {
    return request.post('/post/CreateFollowPost', { content, postId })
  },
  getPageNo(opts: IGetPageNoOptions) {
    return request.post('/post/GetPageNo', opts)
  }
}

export interface IGetPageNoOptions {
  postId: number
  pageSize: number
}

export interface IGetThreadOptions {
  pageSize: number
  pageNo: number
  tiebaId: number
  isFine?: boolean
}

export interface IGetPostOptions {
  pageSize: number
  pageNo: number
  isSeeLz?: boolean
  threadId: number
}

export interface IGetFollowPostOptions {
  pageSize: number
  pageNo: number
  postId: number
}
