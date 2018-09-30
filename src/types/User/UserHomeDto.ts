export class UserHomeDto {
  public postCount!: number
  public tiebaFollowCount!: number
  public followCount!: number
  public fansCount!: number
  public userName!: string
  public headImg!: string
  public isSelf!: boolean
  public isFollowed!: boolean

  constructor() {
    this.headImg = ''
    this.userName = ''
  }
}
