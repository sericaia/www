import React from 'react'

const iconToEmoji = {
  star: '🌟',
  student: '🤓',
  podcast: '🎧',
  webinar: '👩‍💻',
}

const Icons = ({ icons }) => {
  if (!icons || !icons.length) return null

  return icons.map(icon =>
    iconToEmoji[icon] ? (
      <span key={icon} style={{ marginRight: '0.3rem' }}>
        {iconToEmoji[icon]}
      </span>
    ) : null
  )
}

export default Icons
