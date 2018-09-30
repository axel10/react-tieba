import { UserListDto } from '../User/UserListDto'

export class ThreadDetailDto {
  public id: number
  public content: string
  public createTimeStr: string
  public title: string
  public creator: UserListDto
  public isCollected: boolean

  constructor() {
    this.creator = new UserListDto()
  }
}
