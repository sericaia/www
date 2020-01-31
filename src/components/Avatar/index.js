import React from 'react'
import Img from 'gatsby-image'

const Avatar = ({ src }) => (
  <Img
    style={{
      borderRadius: '50%',
      height: '5rem',
      minWidth: '5rem',
      margin: '0.5rem',
    }}
    fluid={src}
    alt="Daniela's personal picture"
  />
)

export default React.memo(Avatar)
