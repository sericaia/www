import { Link, useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import PropTypes from 'prop-types'
import React from 'react'
import Media from '../Media'
import Navigation from '../Navigation'

const Header = ({ siteTitle, routing }) => {
  const avatar = useStaticQuery(graphql`
    query imageQuery {
      file(relativePath: { eq: "daniela.png" }) {
        childImageSharp {
          fluid(maxWidth: 256) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <header
      style={{
        marginBottom: `1.45rem`,
      }}
    >
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <Link
          to="/"
          style={{
            color: `#FB4485`,
            textDecoration: `none`,
          }}
        >
          <Img
            style={{
              borderRadius: '50%',
              height: '5rem',
              minWidth: '5rem',
              margin: '0.5rem',
            }}
            fluid={avatar.file.childImageSharp.fluid}
            alt="Daniela's personal picture"
          />
        </Link>
        <div
          style={{
            alignSelf: 'center',
          }}
        >
          <h1 style={{ margin: 0 }}>
            <Link
              to="/"
              style={{
                color: `#FB4485`,
                textDecoration: `none`,
              }}
            >
              {siteTitle}
            </Link>
          </h1>
          <div
            style={{
              alignSelf: 'flex-end',
            }}
          >
            <Media />
            <Navigation routing={routing} />
          </div>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
  routing: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      section: PropTypes.shape({
        title: PropTypes.string.isRequired,
        color: PropTypes.string,
        lettersNumber: PropTypes.number,
      }),
      href: PropTypes.string.isRequired,
    })
  ),
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
