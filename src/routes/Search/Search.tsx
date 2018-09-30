import { connect } from 'dva'
import React from 'react'
import * as router from 'react-router-redux'
import DarkHeader from 'src/components/Header/DarkHeader'
import history from 'src/history'
import { IBaseProps } from 'src/mixin/IBaseProps'
import { ISearchState } from 'src/models/search'
import { TiebaTitleTip } from 'src/types/Tieba/TiebaTitleTip'
import { historyPush } from 'src/utils/utils'
import style from './Search.scss'

interface IProps extends IBaseProps {
  search: ISearchState
}

interface IState {
  searchWord: string
  timer: number
}

class Search extends React.Component<IProps, IState> {
  public state = {
    searchWord: '',
    timer: 0
  }

  private dispatch = this.props.dispatch

  private searchInput: HTMLInputElement

  public constructor(props) {
    super(props)
    this.dispatch({ type: 'search/init' })
  }

  public componentDidMount() {
    this.searchInput.focus()
  }

  public render() {
    const histories = this.props.search.histories
    const tips = this.props.search.tips
    return (
      <div className={style.Search}>
        <DarkHeader title={'搜索'} />
        <div className={style.searchInput}>
          <div className={style.wrap}>
            <div className={style.input}>
              <input
                type="text"
                onInput={this.handleSearchInput}
                value={this.state.searchWord}
                ref={(o) => {
                  this.searchInput = o
                }}
              />
              {this.state.searchWord ? (
                <i
                  className={'icon-close1 iconfont'}
                  onClick={this.resetInput}
                />
              ) : (
                ''
              )}
            </div>
            <div className={style.btn} onClick={this.nav}>
              进吧
            </div>
          </div>
        </div>
        <div className={style.main}>
          {/*          <div className={style.tab}>
            <div className={style.wrap}>
              <div className={style.left}>搜吧</div>
              <div className={style.right}>搜帖</div>
            </div>
          </div>*/}
          {tips.length ? (
            <div className={style.tips}>
              <ul>
                {tips.map((o, i) => (
                  <li
                    className={style.tip}
                    key={i}
                    onClick={this.jump.bind(this, o)}
                  >
                    {o.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={style.history}>
              <div className={style.section}>
                {histories.length ? (
                  <div className={style.title}>我爱逛的吧</div>
                ) : (
                  ''
                )}
                <ul className={style.items}>
                  {histories.map((o, i) => (
                    <li
                      className={style.item}
                      key={i}
                      onClick={historyPush.bind(this, `/tieba/${o}`)}
                    >
                      <p className={style.title}>{o}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {/*        <div className={style.info}>
          <img src='/info.jpg' alt=''/>
        </div>*/}
      </div>
    )
  }

  public componentWillUnmount() {
    this.dispatch({ type: 'search/reset' })
  }

  private handleSearchInput = (e: React.FormEvent) => {
    clearTimeout(this.state.timer)
    const val = (e.currentTarget as HTMLInputElement).value
    this.setState({ searchWord: val })

    const timer = window.setTimeout(() => {
      if (val.length) {
        this.dispatch({ type: 'search/fetchTips', title: val })
      } else {
        this.dispatch({ type: 'search/setTips', tips: [] })
      }
    }, 300)
    this.setState({ timer })
  }
  private jump = (item: TiebaTitleTip) => {
    this.setState({ searchWord: item.title })
    this.nav()
  }
  private nav = () => {
    const word = this.state.searchWord
    if (word.length) {
      this.dispatch({ type: 'search/addHistory', history: word })
      history.push(`/tieba/${word}`)
    } else {
      return
    }
  }
  private resetInput = () => {
    this.setState({ searchWord: '' })
  }
}

export default connect((state) => {
  return { ...state }
})(Search)
