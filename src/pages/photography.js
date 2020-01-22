import React from 'react'
import Img from 'gatsby-image'
import Layout from '../components/Layout'

const PhotographyPage = ({ data }) => {
  const { pictures } = data

  return (
    <Layout>
      <p>
        Taking pictures helps me to (1) better observe the world and (2) respect
        life.
      </p>

      {pictures.edges.map(picture => (
        <Img
          key={picture.node.childImageSharp.fluid.originalName}
          style={{
            margin: '1rem',
          }}
          fluid={picture.node.childImageSharp.fluid}
          alt={picture.node.childImageSharp.fluid.originalName}
        />
      ))}
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
