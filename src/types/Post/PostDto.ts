import { UserListDto } from '../User/UserListDto'
import { FollowPostDto } from './FollowPostDto'

export class PostDto {
  public id!: number
  public content!: string
  public floor!: number
  public creator!: UserListDto
  public createTimeStr!: string
  public followPostCount!: number
  public isCollected: boolean

  public followPosts!: FollowPostDto[]

  constructor() {
    this.creator = new UserListDto()
    this.followPosts = []
    this.floor = null
  }
}
