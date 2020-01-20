import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import EmailIcon from '../images/svgs/email.svg'
import GithubIcon from '../images/svgs/github.svg'
import LinkedinIcon from '../images/svgs/linkedin.svg'
import TwitterIcon from '../images/svgs/twitter.svg'

const Media = () => {
  const data = useStaticQuery(graphql`
    query metadataQuery {
      site {
        siteMetadata {
          links {
            email
            github
            linkedin
            twitter
          }
        }
      }
    }
  `)

  const { links } = data.site.siteMetadata

  const media = [
    {
      label: 'Email',
      href: `mailto:${links.email}`,
      image: EmailIcon,
    },
    {
      label: 'Github',
      href: links.github,
      image: GithubIcon,
    },
    {
      label: 'Linkedin',
      href: links.linkedin,
      image: LinkedinIcon,
    },
    {
      label: 'Twitter',
      href: links.twitter,
      image: TwitterIcon,
    },
  ]

  return (
    <>
      {media.map(media => (
        <a
          style={{
            padding: '.5rem',
          }}
          key={media.label}
          href={media.href}
          aria-label={media.label}
        >
          <media.image width="24" />
        </a>
      ))}
    </>
  )
}

export default Media
