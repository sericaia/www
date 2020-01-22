import React from 'react'
import Layout from '../components/Layout'
import ArticleList from '../components/ArticleList'

const IndexPage = ({ data }) => {
  const { posts } = data
  return (
    <Layout>
      <ArticleList articles={posts.nodes} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query allPostsQuery {
    posts: allMdx(
      sort: { fields: frontmatter___date, order: DESC }
      filter: { fields: { type: { eq: "blogpost" } } }
    ) {
      totalCount
      nodes {
        id
        excerpt
        fields {
          pathname
        }
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
        }
        parent {
          ... on File {
            name
          }
        }
      }
    }
  }
`

export default IndexPage
