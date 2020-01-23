module.exports = {
  siteMetadata: {
    title: `Daniela Matos de Carvalho`,
    description: `Daniela Matos de Carvalho personal website - blog and contacts`,
    author: `@sericaia`,
    siteUrl: `https://www.sericaia.me`,
    links: {
      email: 'danielabmcarvalho@gmail.com',
      github: 'https://github.com/sericaia',
      linkedin: 'https://www.linkedin.com/in/danielabmcarvalho',
      twitter: 'https://twitter.com/sericaia',
    },
    routing: [
      {
        label: 'engineer',
        section: {
          title: 'about me',
          color: 'pink',
          lettersNumber: 5,
        },
        href: '/about/',
      },
      {
        label: 'writer',
        section: {
          title: 'articles',
          color: 'blue',
          lettersNumber: 3,
        },
        href: '/',
      },
      {
        label: 'speaker',
        section: {
          title: 'talks',
          color: 'blue',
          lettersNumber: 3,
        },
        href: '/talks/',
      },
      {
        label: 'photographer',
        section: {
          title: 'photography',
          color: 'green',
          lettersNumber: 5,
        },
        href: '/photography/',
      },
      // {
      //   label: 'mentor',
      //   section: {
      //     title: 'training',
      //     color: 'blue',
      //     lettersNumber: 3,
      //   },
      //   href: '/training/',
      // },
    ],
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /images\/.*\.svg/,
        },
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#FB4485`,
        theme_color: `#FB4485`,
        display: `minimal-ui`,
        icon: `src/images/shortcake.png`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.md', '.mdx'],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: true,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              withWebp: true,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: `assets`,
            },
          },
        ],
        plugins: [
          `gatsby-remark-prismjs`,
          `gatsby-remark-images`,
          `gatsby-remark-copy-linked-files`,
        ],
        defaultLayouts: {
          default: require.resolve('./src/components/Layout/index.js'),
        },
      },
    },
  ],
  // this (optional) plugin enables Progressive Web App + Offline functionality
  // To learn more, visit: https://gatsby.dev/offline
  // `gatsby-plugin-offline`,
}
