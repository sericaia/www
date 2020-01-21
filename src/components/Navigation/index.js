import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'

import FancyTitle from '../FancyTitle'

const Navigation = () => {
  const data = useStaticQuery(graphql`
    query NavigationQuery {
      site {
        siteMetadata {
          routing {
            label
            href
          }
        }
      }
    }
  `)

  const pages = data.site.siteMetadata.routing
  console.log(pages)
  return (
    <div>
      {pages.map(page => (
        <p key={page.label}>
          <Link to={`/${page.href}`}>
            <FancyTitle title={page.label} />
          </Link>
        </p>
      ))}
    </div>
  )
}

export default Navigation
