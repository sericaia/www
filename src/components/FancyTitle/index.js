import React from 'react'
import PropTypes from 'prop-types'

const colors = {
  blue: '#3369E8',
  green: '#009925',
  grey: '#666666',
  yellow: '#EEB211',
  red: '#D50F25',
  pink: '#FB4485',
}

const FancyTitle = ({ title, color = 'blue', lettersNumber = 3 }) => {
  const firstTextToken = title.substring(0, lettersNumber)
  const lastTextToken = title.substring(lettersNumber)

  return (
    <>
      <span style={{ color: colors[color] }}>{firstTextToken}</span>
      {lastTextToken}
    </>
  )
}

FancyTitle.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.oneOf(Object.keys(colors)),
  lettersNumber: PropTypes.number,
}

export default FancyTitle
