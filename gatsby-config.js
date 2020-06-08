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
          color: 'yellow',
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
        name: `sericaia-www-personal-page`,
        short_name: `sericaia-www`,
        start_url: `/`,
        background_color: `#E70567`,
        theme_color: `#E70567`,
        display: `minimal-ui`,
        icon: `src/images/sericaia.png`,
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
              linkImagesToOriginal: false,
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
    {
      resolve: `gatsby-plugin-feed-mdx`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.pathname,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.pathname,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                })
              })
            },
            query: `
              {
                allMdx(
                  sort: { fields: frontmatter___date, order: DESC }
                  filter: { fields: { type: { eq: "blogpost" } } }
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields {
                        pathname
                      }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: 'Daniela Matos de Carvalho',
            match: '^/blog/',
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
  ],
}
