import { connect } from 'dva'
import React from 'react'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { EditUserDto } from 'src/types/User/EditUserDto'
import { Sex } from 'src/utils/enum/Sex'
import { getBindFieldObj, triggerClick } from 'src/utils/utils'
import DarkHeader from '../../components/Header/DarkHeader'
import history from '../../history'
import userService from '../../services/userService'
import Message from '../../utils/Message'
import style from './EditUser.scss'

interface IState {
  file: File
  thumb: any
  data: EditUserDto
  summary: string
}

class EditUser extends React.Component<IBaseProps, IState> {
  public state: IState = {
    file: null,
    thumb: null,
    summary: '',
    data: new EditUserDto()
  }

  public constructor(props) {
    super(props)
    userService.getEditUserData().then((data) => {
      this.setState({ data })
    })
  }

  public render() {
    const data = this.state.data
    const thumb = this.state.thumb
    return (
      <div className={style.EditUser}>
        <DarkHeader
          right={<span onClick={this.submit}>保存</span>}
          title={'我的资料'}
        />
        <div className={style.main}>
          <div className={style.headImg} onClick={this.showFileDialog}>
            <div
              className={style.img}
              style={{
                backgroundImage: `url('${thumb ? thumb : data.headImg}')`
              }}
            />
            <h5 className={style.name}>{data.userName}</h5>
            <div className={style.right}>
              <p className={style.tip}>更改头像</p>
              <p className={style.small}>上传大图可能较缓慢</p>
            </div>
          </div>
          <div className={style.sex}>
            <span>性别</span>
            <span>
              <label>
                <input
                  onChange={this.bindField}
                  type="radio"
                  name="sex"
                  value={Sex.Male.toString()}
                  checked={data.sex === Sex.Male}
                />
                男
              </label>
            </span>
            <span>
              <label>
                <input
                  onChange={this.bindField}
                  type="radio"
                  name="sex"
                  value={Sex.FeMale.toString()}
                  checked={data.sex === Sex.FeMale}
                />
                女
              </label>
            </span>
          </div>
          <div className={style.summary}>
            <p className={style.tip}>个人简介</p>
            <div className={style.input}>
              <textarea
                value={data.summary}
                name="summary"
                onInput={this.bindField}
              />
            </div>
          </div>
        </div>
        <input
          type="file"
          style={{ display: 'none' }}
          id="file"
          name="file"
          onChange={this.bindFile}
        />
      </div>
    )
  }

  private bindFile = (e: React.FormEvent) => {
    const obj = getBindFieldObj(e)
    this.setState(obj as any)
    const reader = new FileReader()
    const that = this
    reader.onloadend = () => {
      that.setState({ thumb: reader.result })
    }
    reader.readAsDataURL(obj.file)
  }

  private bindField = (e: React.FormEvent) => {
    const obj = getBindFieldObj(e)
    this.setState({ data: { ...this.state.data, ...obj } })
  }
  private showFileDialog = () => {
    triggerClick('#file')
  }
  private submit = () => {
    const formData = new FormData()
    const data = this.state.data
    formData.append('Sex', data.sex.toString())
    formData.append('Summary', data.summary)
    formData.append('files', this.state.file)

    userService.editUserData(formData).then(() => {
      Message.toast('修改成功')
      history.goBack()
    })
  }
}

export default connect((state) => {
  return { ...state }
})(EditUser)
