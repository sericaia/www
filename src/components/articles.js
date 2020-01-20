import React from 'react'
import { Link } from 'gatsby'

const Articles = ({ articles }) => (
  <>
    <h2>
      <span style={{ color: '#3369E8' }}>art</span>icles
    </h2>
    {articles.map(post => {
      return (
        <div key={post.id}>
          <h3
            style={{
              marginBottom: '0.3rem',
            }}
          >
            <Link
              to={`/blogposts/${post.parent.name}`}
              style={{
                textDecoration: 'none',
                color: '#333',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              {post.frontmatter.title}
            </Link>
          </h3>
          <h4
            style={{
              color: 'grey',
              marginBottom: '0.3rem',
              fontWeight: 400,
            }}
          >
            {post.frontmatter.date}
          </h4>
          <p
            style={{
              fontSize: '0.9rem',
              fontStyle: 'italic',
            }}
          >
            {post.excerpt}
          </p>
        </div>
      )
    })}
  </>
)

export default Articles
