import React from 'react'

import Layout from '../components/Layout'
import SEO from '../components/SEO'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h2>Oops...</h2>
    <img src="https://http.cat/404" alt="Content not found (404)" />
  </Layout>
)

export default NotFoundPage
