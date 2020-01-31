import React from 'react'
import PropTypes from 'prop-types'
import Media from '../Media'

const Footer = ({ links }) => (
  <footer
    style={{
      textAlign: 'center',
    }}
  >
    {/* © {new Date().getFullYear()} - Daniela Matos de Carvalho */}
    <Media {...links} />
  </footer>
)

Footer.propTypes = {
  links: PropTypes.shape({
    email: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    linkedin: PropTypes.string.isRequired,
    twitter: PropTypes.string.isRequired,
  }),
}

export default Footer
