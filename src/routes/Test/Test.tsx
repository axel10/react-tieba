// Require Editor JS files.
// @ts-ignore
import React from 'react'
import { Link } from 'react-router-dom'
// Require Font Awesome.
import tiebaService from 'src/services/tiebaService'

export default class Test extends React.Component {
  public componentDidMount() {
    async function test() {
      return tiebaService.getTip('a')
    }

    async function f() {
      throw new Error('出错了')
    }

    f().then((v) => console.log(v), (e) => console.log(e))
  }

  public render() {
    return (
      <div style={{ height: '2000px', position: 'relative' }}>
        <div className="links" style={{ position: 'fixed' }}>
          <Link to={'/test/1'}>123</Link>
          <Link to={'/test/2'}>123</Link>
        </div>
        <div style={{ position: 'absolute', bottom: 0 }}>
          <Link to={'/test/1'}>123</Link>
        </div>
      </div>
    )
  }
}
