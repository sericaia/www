import React from 'react'
import Layout from '../components/Layout'
import talks from '../../content/talks'

const TalksPage = () => (
  <Layout>
    <p>I've spoke to crowds but meetups are the ones I'm more afraid of.</p>
    {talks.map((talk, idx) => {
      return (
        <div key={`${idx}${talk.title}`}>
          <h3>{talk.title}</h3>
          <h4>{talk.event}</h4>
        </div>
      )
    })}
  </Layout>
)

export default TalksPage
