import React from 'react'

import Layout from '../components/Layout'
import Dates from '../components/Dates'
import talks from '../../content/talks'

const TalksPage = ({ location }) => (
  <Layout pathname={location.pathname}>
    <p>I've spoke to crowds but meetups are the ones I'm more afraid of.</p>
    {talks.map((talk, idx) => {
      return (
        <div key={`${idx}${talk.title}`}>
          <h3>{talk.title}</h3>
          <h4>{talk.event}</h4>
          <h5
            style={{
              color: 'grey',
              marginBottom: '0.3rem',
              fontWeight: 400,
            }}
          >
            <Dates date={talk.date} />
          </h5>
          <p></p>
        </div>
      )
    })}
  </Layout>
)

export default TalksPage
