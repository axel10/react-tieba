export class LoadAble<T> {
  set data(val: T[]) {
    this._data = val
    if (this._data.length === 0 && val.length === 0) {
      this.isEmpty = true
    }
    if (val.length > 0) {
      this.isEmpty = false
    }
    this.isLoaded = true
  }
  get data() {
    return this._data
  }
  public isLoaded!: boolean
  public isEnd!: boolean
  public pageSize!: number
  public pageNo!: number
  public isLoading!: boolean
  public isEmpty!: boolean
  private _data!: T[]

  constructor(size: number) {
    this.data = []
    this.isLoaded = false
    this.isEnd = false
    this.pageNo = 1
    this.pageSize = size
    this.isLoading = false
    this.isEmpty = false
  }
}
