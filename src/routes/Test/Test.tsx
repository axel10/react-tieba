// Require Editor JS files.
// @ts-ignore
import React from 'react'
import { Link } from 'react-router-dom'
// Require Font Awesome.
import tiebaService from 'src/services/tiebaService'

export default class Test extends React.Component {

  public componentDidMount (): void {

    document.body.className = 'hide-scroll'

/*    const div = document.createElement('div')
    div.style.height = 2000+'px'
    div.style.position = 'absolute'
    document.body.appendChild(div)*/
  }

  public render () {
    function MyComp (args) {
      return(
        <div>mycomp</div>
      )
    }

    return (
      <div style={{ position: 'relative' }}>
        <Link to={'/test/1'}>
          123
        </Link>

      </div>
    )
  }
}
