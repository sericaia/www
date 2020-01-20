import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

const ArticleSummary = ({ link, title, date, excerpt }) => (
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
        {title}
      </Link>
    </h3>
    <h4
      style={{
        color: 'grey',
        marginBottom: '0.3rem',
        fontWeight: 400,
      }}
    >
      {date}
    </h4>
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
  excerpt: PropTypes.string.isRequired,
}

export default ArticleSummary
