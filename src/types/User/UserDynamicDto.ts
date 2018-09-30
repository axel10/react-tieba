import { ThreadListDto } from '../Thread/ThreadListDto'

export class UserDynamicDto {
  public content: string
  public tiebaTitle: string
  public createTimeStr: string
  public threadId: number
  public postId?: number
  public thread: ThreadListDto
  public covers: string[]
}
