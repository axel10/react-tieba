import { Sex } from '../../utils/enum/Sex'

export class EditUserDto {
  public sex: Sex
  public summary: string
  public userName: string
  public headImg: string
}
