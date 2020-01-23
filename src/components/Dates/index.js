import React from 'react'
import format from 'date-fns/format'
import isArray from 'lodash/isArray'

const Dates = ({ date }) => {
  if (!isArray(date)) return null

  if (date.length === 2) {
    const from = format(new Date(date[0]), 'MMMM dd, yyyy')
    const to = format(new Date(date[1]), 'MMMM dd, yyyy')

    return (
      <>
        {from} to {to}
      </>
    )
  }

  if (date.length === 1) {
    const formattedDate = format(new Date(date), 'MMMM dd, yyyy')
    return formattedDate
  }

  return null // invalid
}

export default Dates
