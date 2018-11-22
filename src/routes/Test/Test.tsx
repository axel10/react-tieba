// Require Editor JS files.
// @ts-ignore
import React from 'react'
import { Link } from 'react-router-dom'
// Require Font Awesome.
import tiebaService from 'src/services/tiebaService'

export default class Test extends React.Component {
  public componentDidMount () {
    console.log(this.props)
  }

  public render () {
    function MyComp (args) {
      return(
        <div>mycomp</div>
      )
    }

    return (
      <div style={{ height: '2000px', position: 'relative' }}>
        <Link to={'/test/1'}>
          123
        </Link>

        <MyComp>
          <div></div>
        </MyComp>

      </div>
    )
  }
}
