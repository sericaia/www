import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'

const AboutPage = ({ location, data: { mdx } }) => {
  return (
    <Layout pathname={location.pathname}>
      <MDXRenderer>{mdx.body}</MDXRenderer>
    </Layout>
  )
}

export const pageQuery = graphql`
  query aboutPageQuery {
    mdx(fileAbsolutePath: { regex: "/content/about.md/" }) {
      id
      body
    }
  }
`

export default AboutPage
