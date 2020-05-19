import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import Icons from '../Icons'

const ArticleSummary = ({ link, title, date, icons, excerpt }) => (
  <div>
    <h3
      style={{
        marginBottom: '0.3rem',
      }}
    >
      <Link
        to={link}
        style={{
          textDecoration: 'none',
          color: '#333',
          fontWeight: 'bold',
          fontSize: '1.2rem',
        }}
      >
        <Icons icons={icons} />
        {title}
      </Link>
    </h3>
    <p
      style={{
        color: '#767676',
        marginBottom: '0.3rem',
        fontWeight: 400,
        lineHeight: '1.1',
      }}
    >
      {date}
    </p>
    <p
      style={{
        fontSize: '0.9rem',
        fontStyle: 'italic',
      }}
    >
      {excerpt}
    </p>
  </div>
)

ArticleSummary.propTypes = {
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  icons: PropTypes.arrayOf(PropTypes.string),
  excerpt: PropTypes.string.isRequired,
}

export default ArticleSummary
