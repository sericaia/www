import { Link } from 'gatsby'
import React from 'react'

const pages = [
  {
    label: 'engineer',
    href: '/about',
  },
  {
    label: 'speaker',
    href: '/talks',
  },
  {
    label: 'writer',
    href: '/articles',
  },
  {
    label: 'photographer',
    href: '/photography',
  },
  {
    label: 'mentor',
    href: '/training',
  },
]

const Navigation = () => (
  <div>
    {pages.map(page => (
      <p key={page.label}>
        <Link to={`/${page.href}`}>{page.label}</Link>
      </p>
    ))}
  </div>
)

export default Navigation
