import React from 'react'
import Layout from '../components/Layout'
import talks from '../../content/talks'

const TalksPage = () => (
  <Layout>
    {talks.map(talk => {
      return (
        <div>
          <h3>{talk.title}</h3>
          <h4>{talk.event}</h4>
        </div>
      )
    })}
  </Layout>
)

export default TalksPage
