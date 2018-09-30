import { UserListDto } from './UserListDto'

export class MessageDto {
  public sender: UserListDto
  public content: string
  public tiebaTitle: string
  public threadTitle: string
  public threadId: number
  public createTimeStr: string
}
