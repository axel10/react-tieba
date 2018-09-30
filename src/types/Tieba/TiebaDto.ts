import { LevelInfo } from 'src/types/User/LevelInfo'

export class TiebaDto {
  public id: number
  public hasTieba: boolean | null
  public title: string
  public levelInfo: LevelInfo
  public followCount: number
  public experience: number
  public headImg: string
  public isCanSign: boolean
  public postCount: number
}
