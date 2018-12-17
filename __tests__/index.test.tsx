/*
import { configure } from 'enzyme';
import * as EnzymeAdapter from 'enzyme-adapter-react-16';
configure({ adapter: new EnzymeAdapter() });
*/

import { shallow } from 'enzyme'
import * as React from 'react'
import Button from '../src/components/Button/Button'

describe('A suite',() => {
  it('should true', () => {
    expect(true).toBe(true)
  })

  test('true',() => {
    const btn = shallow(<Button>123</Button>)
    expect(btn.text()).toEqual('123')
  })
})
