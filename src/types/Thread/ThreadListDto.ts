import { UserListDto } from '../User/UserListDto'

export class ThreadListDto {
  public id: number
  public content: string
  public covers: string[]
  public createTimeStr: string
  public postCount: number
  public title: string
  public creator: UserListDto
}
