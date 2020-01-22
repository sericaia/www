import React from 'react'
import ArticleSummary from '../ArticleSummary'

const Articles = ({ articles }) => (
  <>
    {articles.map(post => (
      <ArticleSummary
        key={post.id}
        link={post.fields.pathname}
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        excerpt={post.excerpt}
      />
    ))}
  </>
)

export default Articles
