import { UserListDto } from '../User/UserListDto'

export class FollowPostDto {
  public creator: UserListDto
  public content: string
  public createTimeStr?: string
  public id: number

  constructor() {
    this.creator = new UserListDto()
  }
}
