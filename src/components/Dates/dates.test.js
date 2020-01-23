import React from 'react'
import { render } from '@testing-library/react'
import Dates from '.'

describe('Dates', () => {
  it('renders correctly one date', () => {
    const date = ['2019-09-12']
    const { container } = render(<Dates date={date} />)
    expect(container).toMatchSnapshot()
  })

  it('renders correctly from and to dates', () => {
    const date = ['2017-10-12', '2017-10-13']
    const { container } = render(<Dates date={date} />)
    expect(container).toMatchSnapshot()
  })
})
