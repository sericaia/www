import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Picture from '../components/Picture'

const PhotographyPage = ({ location, data }) => {
  const { pictures } = data

  return (
    <Layout pathname={location.pathname}>
      <p>
        Taking pictures helps me to (1) better observe the world and (2) respect
        life.
      </p>

      <ul style={{ listStyle: 'none', marginLeft: 0 }}>
        {pictures.edges.map((picture) => (
          <Picture
            key={picture.node.childImageSharp.fluid.originalName}
            fluidImg={picture.node.childImageSharp.fluid}
          />
        ))}
      </ul>
    </Layout>
  )
}

export const pageQuery = graphql`
  query allPicturesQuery {
    pictures: allFile(
      filter: { relativeDirectory: { eq: "pictures" } }
      sort: { order: ASC, fields: name }
    ) {
      edges {
        node {
          id
          childImageSharp {
            fluid {
              originalName
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  }
`

export default PhotographyPage
