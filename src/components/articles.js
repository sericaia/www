import React from 'react'
import { Link } from 'gatsby'
import { format } from 'date-fns'

const Articles = ({ articles }) => (
  <>
    <h2>
      <span style={{ color: '#3369E8' }}>art</span>icles
    </h2>
    {articles.map(post => {
      return (
        <div
          key={post.id}
          style={{
            marginBottom: '1rem',
          }}
        >
          <p>
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
          </p>
          <p
            style={{
              color: 'grey',
            }}
          >
            {format(new Date(post.frontmatter.date), 'MMMM dd, yyyy')}
          </p>
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
