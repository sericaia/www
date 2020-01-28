import React from 'react'

import Layout from '../components/Layout'
import Dates from '../components/Dates'
import Icons from '../components/Icons'
import talks from '../../content/talks'

const TalksPage = ({ location }) => {
  const renderMediaSection = media => {
    const keys = Object.keys(media)
    return keys.map(key => {
      if (!media[key] || key === 'picture') return null

      return (
        <a key={key} href={media[key]} style={{ marginRight: '0.5rem' }}>
          {key}
        </a>
      )
    })
  }

  return (
    <Layout pathname={location.pathname}>
      <p>I've spoke to crowds but meetups are the ones I'm more afraid of.</p>
      {talks.map((talk, idx) => {
        return (
          <div key={`${idx}${talk.title}`}>
            <h3 style={{ marginBottom: '0.3rem', fontSize: '1.2rem' }}>
              <Icons icons={talk.icons} />
              {talk.title}{' '}
              <span
                style={{
                  color: 'grey',
                  marginBottom: '0.3rem',
                  fontWeight: 400,
                  fontSize: '1rem',
                  fontStyle: 'italic',
                }}
              >
                @ {talk.event} ({talk.location})
              </span>
            </h3>
            <h4
              style={{
                color: 'grey',
                marginBottom: '0.3rem',
                fontWeight: 400,
              }}
            >
              <Dates date={talk.date} />
            </h4>
            {renderMediaSection(talk.media)}
            <p
              style={{
                fontSize: '0.9rem',
                fontStyle: 'italic',
              }}
            >
              {talk.description}
            </p>
            {talk.media.picture && (
              <img
                src={talk.media.picture}
                alt={`Daniela at ${talk.event}`}
                style={{ maxWidth: 512, width: '100%' }}
              />
            )}
          </div>
        )
      })}
    </Layout>
  )
}

export default TalksPage
