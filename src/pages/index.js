import React from 'react'
import Layout from '../components/Layout'
import ArticleList from '../components/ArticleList'

const IndexPage = ({ location, data }) => {
  const { posts } = data

  return (
    <Layout pathname={location.pathname}>
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
          icons
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
