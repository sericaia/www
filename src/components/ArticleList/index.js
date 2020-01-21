import React from 'react'
import ArticleSummary from '../ArticleSummary'
import FancyTitle from '../FancyTitle'

const Articles = ({ articles }) => (
  <>
    <FancyTitle title="articles" color="blue" lettersNumber={3} />
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
