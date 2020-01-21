import React from 'react'
import { render } from '@testing-library/react'
import ArticleSummary from './article-summary'

describe('ArticleSummary', () => {
  it('renders correctly', () => {
    const props = {
      link: '/summary',
      title: 'Fake article',
      date: 'January 21, 2020',
      excerpt: 'lorem ipsum',
    }
    const { container } = render(<ArticleSummary {...props} />)
    expect(container).toMatchSnapshot()
  })
})
