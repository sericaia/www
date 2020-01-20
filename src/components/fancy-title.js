import React from 'react'
import PropTypes from 'prop-types'

const colors = {
  blue: '#3369E8',
}

const FancyTitle = ({ title, color = 'blue', lettersNumber = 3 }) => {
  const firstTextToken = title.substring(0, lettersNumber)
  const lastTextToken = title.substring(lettersNumber)

  return (
    <h2>
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
