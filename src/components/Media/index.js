import React from 'react'

import EmailIcon from '../../images/svgs/email.svg'
import GithubIcon from '../../images/svgs/github.svg'
import LinkedinIcon from '../../images/svgs/linkedin.svg'
import TwitterIcon from '../../images/svgs/twitter.svg'

const Media = ({ email, github, linkedin, twitter }) => {
  const media = [
    {
      label: 'Email',
      href: `mailto:${email}`,
      image: EmailIcon,
    },
    {
      label: 'Github',
      href: github,
      image: GithubIcon,
    },
    {
      label: 'Linkedin',
      href: linkedin,
      image: LinkedinIcon,
    },
    {
      label: 'Twitter',
      href: twitter,
      image: TwitterIcon,
    },
  ]

  return (
    <>
      {media.map((media) => (
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

export default React.memo(Media)
