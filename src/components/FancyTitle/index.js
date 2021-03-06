import React from 'react'
import PropTypes from 'prop-types'

const colors = {
  blue: '#3369E8',
  green: '#009925',
  grey: '#666666',
  yellow: '#BD8D00',
  red: '#D50F25',
  pink: '#E70567',
}

const FancyTitle = ({ title, color = 'blue', lettersNumber = 3 }) => {
  const firstTextToken = title.substring(0, lettersNumber)
  const lastTextToken = title.substring(lettersNumber)

  return (
    <h2 aria-label={title}>
      <span style={{ color: colors[color] }}>{firstTextToken}</span>
      {lastTextToken}
    </h2>
  )
}

FancyTitle.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.oneOf(Object.keys(colors)),
  lettersNumber: PropTypes.number,
}

export default FancyTitle
