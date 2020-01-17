import React from "react"
import SEO from "../components/seo"
import Layout from "../components/layout"
import Articles from "../components/articles"

const IndexPage = ({ data }) => {
  const { posts } = data

  const postsDesc = posts.nodes.reverse()
  return (
    <Layout>
      <SEO title="Home" />
      <Articles articles={postsDesc} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query allPostsQuery {
    posts: allMdx(sort: { fields: frontmatter___date }) {
      totalCount
      nodes {
        id
        excerpt
        frontmatter {
          title
          date
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
