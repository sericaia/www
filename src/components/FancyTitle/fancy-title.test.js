import React from 'react'
import { render } from '@testing-library/react'
import FancyTitle from '.'

describe('FancyTitle', () => {
  it('renders correctly', () => {
    const props = {
      title: 'photography',
      color: 'blue',
      lettersNumber: 5,
    }
    const { container } = render(<FancyTitle {...props} />)
    expect(container).toMatchSnapshot()
  })
})
