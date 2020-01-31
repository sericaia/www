import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import SEO from '../SEO'
import Header from '../Header'
import Footer from '../Footer'
import FancyTitle from '../FancyTitle'
import './layout.css'

const Layout = ({ pathname, setSEO = true, children }) => {
  const data = useStaticQuery(graphql`
    query SiteQuery {
      avatar: file(relativePath: { eq: "daniela.png" }) {
        childImageSharp {
          fluid(maxWidth: 256) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      site {
        siteMetadata {
          title
          links {
            email
            github
            linkedin
            twitter
          }
          routing {
            label
            section {
              title
              color
              lettersNumber
            }
            href
          }
        }
      }
    }
  `)

  const currentPage = data.site.siteMetadata.routing.find(
    page => page.href === pathname
  )

  return (
    <>
      {setSEO && currentPage && <SEO title={currentPage.section.title} />}
      <Header
        siteTitle={data.site.siteMetadata.title}
        routing={data.site.siteMetadata.routing}
        avatar={data.avatar}
        links={data.site.siteMetadata.links}
      />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0px 1.0875rem 1.45rem`,
          paddingTop: 0,
        }}
      >
        <h2 style={{ height: '1.75rem' }}>
          {currentPage && <FancyTitle {...currentPage.section} />}
        </h2>
        <main>{children}</main>
      </div>
      <Footer links={data.site.siteMetadata.links} />
    </>
  )
}

Layout.propTypes = {
  pathname: PropTypes.string,
  setSEO: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Layout
