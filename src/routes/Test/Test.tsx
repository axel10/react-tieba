// Require Editor JS files.
// @ts-ignore
import React from 'react'
import { Link } from 'react-router-dom'
// Require Font Awesome.
import tiebaService from 'src/services/tiebaService'

export default class Test extends React.Component {

  public async componentDidMount () {
    async function* gen1 () {
      yield 'a'
      yield 'b'
      return 2
    }

    async function* gen2 () {
// result 最终会等于 2
      const result = yield* gen1()
      console.log(result)
    }

    console.log('async')
    const gen = gen2()
    console.log(gen.next().then(o => {
      console.log(o)
      return gen.next()
    }))
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
