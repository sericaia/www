import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import Media from '../Media'
import Avatar from '../Avatar'
import Navigation from '../Navigation'

const Header = ({ siteTitle, routing, avatar, links }) => (
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
        <Avatar src={avatar.childImageSharp.fluid} />
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
          <Media {...links} />
          <Navigation routing={routing} />
        </div>
      </div>
    </div>
  </header>
)

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
  links: PropTypes.shape({
    email: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    linkedin: PropTypes.string.isRequired,
    twitter: PropTypes.string.isRequired,
  }),
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
