import React from 'react'
import SEO from '../components/seo'
import Layout from '../components/layout'
import Articles from '../components/articles'
// import Navigation from '../components/navigation'

const IndexPage = ({ data }) => {
  const { posts } = data
  return (
    <Layout>
      <SEO title="Home" />
      {/* <Navigation /> */}
      <Articles articles={posts.nodes} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query allPostsQuery {
    posts: allMdx(
      sort: { fields: frontmatter___date, order: DESC }
      filter: { fileAbsolutePath: { regex: "/blogposts/" } }
    ) {
      totalCount
      nodes {
        id
        excerpt
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
