import { connect } from 'dva'
import React from 'react'
import DarkHeader from '../../components/Header/DarkHeader'
import { IBaseProps } from '../../mixin/IBaseProps'
import { ITieCollectionState } from '../../models/tieCollection'
import { TieCollectionDto } from '../../types/User/TieCollectionDto'
import style from './TieCollection.scss'

interface IProps extends IBaseProps {
  tieCollection: ITieCollectionState
}

class TieCollection extends React.Component<IProps> {
  private dispatch = this.props.dispatch

  public componentDidMount() {
    this.dispatch({ type: 'tieCollection/getData' })
  }

  public render() {
    const data = this.props.tieCollection.collections
    return (
      <div className={style.TieCollection}>
        <DarkHeader title={'我的收藏'} right={<span>编辑</span>} />
        <div className={style.list}>
          <ul>
            {data.map((o: TieCollectionDto, i) => (
              <li key={i} onClick={this.nav.bind(this, i)}>
                <div className={style.item}>
                  <h5 className={style.title}>{o.title}</h5>
                  <div className={style.bottom}>
                    <div className={style.left}>{o.userName}</div>
                    <div className={style.right}>
                      {o.isUpdate ? <span>有更新</span> : ''}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  private nav = (i: number) => {
    this.dispatch({ type: 'tieCollection/toTie', i })
  }
}

export default connect((state) => {
  return { ...state }
})(TieCollection)
