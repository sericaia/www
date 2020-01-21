// This component is a wrapper around all blogposts
// it is a "page" component in a gatsby way (pages can
// be queried using GraphQL) but it is not meant to be
// indexed, so it is located in /components

import React from 'react'
import { graphql, Link } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from './layout'
import SEO from './seo'
import ParentArticleLinks from './parent-articles-links'
import './blogpost-layout.css'

const BlogpostLayoutPage = ({ data: { mdx }, pageContext }) => (
  <Layout>
    <SEO title={mdx.frontmatter.title} />
    <Link
      to={'/'}
      style={{
        color: '#3369E8',
        marginBottom: '0.3rem',
        fontWeight: 'bold',
      }}
    >
      {'< Back to Home'}
    </Link>
    <p
      style={{
        color: 'grey',
        marginBottom: '0.3rem',
        fontWeight: 400,
      }}
    >
      {mdx.frontmatter.date}
    </p>
    <h2>{mdx.frontmatter.title}</h2>
    <MDXRenderer>{mdx.body}</MDXRenderer>

    <ParentArticleLinks
      previous={pageContext.previous}
      next={pageContext.next}
    />
  </Layout>
)

export const pageQuery = graphql`
  query BlogpostLayoutQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`

export default BlogpostLayoutPage
