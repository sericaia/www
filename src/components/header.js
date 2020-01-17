import { Link, useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Media from "./media"
import Img from "gatsby-image"

const Header = ({ siteTitle }) => {
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
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Img
          style={{
            border: "solid",
            borderRadius: "50%",
            borderColor: "transparent",
            borderWidth: "0.5rem",
            minWidth: "6rem",
          }}
          fluid={avatar.file.childImageSharp.fluid}
          alt="Daniela's personal picture"
        />
        <div
          style={{
            alignSelf: "center",
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
              alignSelf: "flex-end",
            }}
          >
            <Media />
          </div>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
