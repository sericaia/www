import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import SEO from '../SEO'
import Header from '../Header'
import Footer from '../Footer'
import FancyTitle from '../FancyTitle'
import './layout.css'

const Layout = ({ pathname, setSEO = true, children }) => {
  let [currentPage, setCurrentPage] = useState()

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

  useEffect(() => {
    if (!pathname) return

    // this effect will run only in the browser
    const page = data.site.siteMetadata.routing.find(
      page => page.href === pathname
    )

    setCurrentPage(page)
  }, [data, pathname])

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
  pathname: PropTypes.string,
  setSEO: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Layout
