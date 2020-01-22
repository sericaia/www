import React from 'react'
import format from 'date-fns/format'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'

const Dates = date => {
  const isArrayDate = isArray(date)

  if (isArrayDate && date.length === 2) {
    const from = format(new Date(date[0]), 'mmmm dd, yyyy')
    const to = format(new Date(date[1]), 'mmmm dd, yyyy')

    return (
      <>
        {from} to {to}
      </>
    )
  }

  if (isString(date) || (isArrayDate && date.length === 1)) {
    const formattedDate = format(new Date(date), 'mmmm dd, yyyy')
    return formattedDate
  }

  return null // invalid
}

export default Dates
