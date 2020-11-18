import React from 'react'
import Img from 'gatsby-image'
import picturesMetadata from '../../../content/pictures-metadata'

const Picture = ({ fluidImg }) => {
  if (!fluidImg) {
    return null
  }

  const filename = fluidImg.originalName

  const pictureData = picturesMetadata.find(
    (picture) => picture.filename === filename
  )

  if (!pictureData) {
    return null
  }

  return (
    <li key={`${pictureData.title}`} style={{ marginBottom: '1.8rem' }}>
      <header>
        <h3 style={{ marginBottom: '0.3rem', fontSize: '1.2rem' }}>
          {pictureData.title}{' '}
          <span
            style={{
              color: '#767676',
              marginBottom: '0.3rem',
              fontWeight: 400,
              fontSize: '1rem',
              fontStyle: 'italic',
            }}
          >
            @ {pictureData.location}
          </span>
        </h3>
      </header>
      <Img
        style={{
          margin: '1rem 0',
        }}
        fluid={fluidImg}
        alt={pictureData.title}
      />
    </li>
  )
}

export default Picture
