// Require Editor JS files.
// @ts-ignore
import React from 'react'
import { Link } from 'react-router-dom'
// Require Font Awesome.
import tiebaService from 'src/services/tiebaService'

export default class Test extends React.Component {

  public componentDidMount (): void {

    setTimeout(() => {
      const test = document.getElementById('test')
      test.style.transition = 'left 1s'
      test.style.left = '100' + 'px'
    }, 50)
  }

  public render () {
    function MyComp (args) {
      return (
        <div>mycomp</div>
      )
    }

    return (
      <div style={{ position: 'relative' }}>
        <Link to={'/test/1'}>
          123
        </Link>

        <div
          style={{ width: 100, height: 100, background: '#000', left: 0, position: 'relative' }}
          id={'test'}>123
        </div>

      </div>
    )
  }
}
