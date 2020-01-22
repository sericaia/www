import React, { Fragment } from 'react'
import { Link } from 'gatsby'

const Navigation = ({ routing: pages }) => {
  return (
    <div>
      {'['}
      {pages.map((page, idx) => (
        <Fragment key={page.label}>
          <span
            style={{
              fontWeight: 500,
              fontStyle: 'italic',
              margin: '0.2rem',
            }}
          >
            <Link
              to={page.href}
              style={{ color: '#333333' }}
              activeStyle={{ textDecoration: 'none' }}
            >
              {page.label}
            </Link>
            {idx !== pages.length - 1 ? ', ' : null}
          </span>
        </Fragment>
      ))}
      {']'}
    </div>
  )
}

export default Navigation
