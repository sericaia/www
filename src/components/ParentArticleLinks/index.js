import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'

const articleLinkStyle = {
  color: '#3369E8',
  marginBottom: '0.3rem',
  fontWeight: 'bold',
  width: '10rem',
}

// links to prev and next articles
const ParentArticleLinks = ({ previous, next }) => (
  <div
    style={{
      display: 'flex',
      justifyContent:
        !previous.title && next.title ? 'flex-end' : 'space-between',
    }}
  >
    {previous.title && (
      <Link style={articleLinkStyle} to={previous.pathname}>
        Previous Article: {previous.title}
      </Link>
    )}
    {next.title && (
      <Link style={articleLinkStyle} to={next.pathname}>
        Next Article: {next.title}
      </Link>
    )}
  </div>
)

ParentArticleLinks.propTypes = {
  previous: PropTypes.shape({
    title: PropTypes.string,
    pathname: PropTypes.string,
  }),
  next: PropTypes.shape({
    title: PropTypes.string,
    pathname: PropTypes.string,
  }),
}

export default ParentArticleLinks
