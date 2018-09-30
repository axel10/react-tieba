import { LoadAble } from 'src/types/Common/LoadAble'

export class PageLoadAble<T> extends LoadAble<T> {
  public itemCount: number

  constructor(pageSize: number) {
    super(pageSize)
    this.itemCount = 0
  }

  get pageCount() {
    return Math.ceil(this.itemCount / this.pageSize) === 0
      ? 1
      : Math.ceil(this.itemCount / this.pageSize)
  }
}
