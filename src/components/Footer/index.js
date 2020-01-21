import React from 'react'
import Media from '../Media'

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: 'center',
      }}
    >
      {/* © {new Date().getFullYear()} - Daniela Matos de Carvalho */}
      <Media />
    </footer>
  )
}

export default Footer
