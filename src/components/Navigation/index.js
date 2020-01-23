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
              fontSize: '1.2rem',
              fontWeight: 550,
              margin: '0.2rem',
            }}
          >
            <Link
              to={page.href}
              style={{ color: '#3369E8' }}
              activeStyle={{ textDecoration: 'none', color: '#333333' }}
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
