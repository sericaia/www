import React from 'react'
import ArticleSummary from './article-summary'

const Articles = ({ articles }) => (
  <>
    <h2>
      <span style={{ color: '#3369E8' }}>art</span>icles
    </h2>
    {articles.map(post =>
      <ArticleSummary
        id={post.id}
        link={post.parent.name}
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        excerpt={post.excerpt}
      />)
    }    
  </>
)

export default Articles
