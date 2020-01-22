import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import SEO from '../SEO'
import Header from '../Header'
import Footer from '../Footer'
import FancyTitle from '../FancyTitle'
import './layout.css'

// Note: accessing window.location here since it is
// not injected in props for functional components
// https://github.com/gatsbyjs/gatsby/issues/1875
const getCurrentPathname = () => window.location.pathname

const Layout = ({ setSEO = true, children }) => {
  const data = useStaticQuery(graphql`
    query SiteMetadataQuery {
      site {
        siteMetadata {
          title
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
    page => page.href === getCurrentPathname()
  )

  return (
    <>
      {setSEO && currentPage && <SEO title={currentPage.section.title} />}
      <Header
        siteTitle={data.site.siteMetadata.title}
        routing={data.site.siteMetadata.routing}
      />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0px 1.0875rem 1.45rem`,
          paddingTop: 0,
        }}
      >
        {currentPage && <FancyTitle {...currentPage.section} />}
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  setSEO: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Layout