import React from 'react'
import { Link } from 'gatsby'

const ArticleSummary = ({ id, link, title, date, excerpt }) => (
  <div key={id}>
    <h3
      style={{
        marginBottom: '0.3rem',
      }}
    >
      <Link
        to={`/blogposts/${link}`}
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

export default ArticleSummary
