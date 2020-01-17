module.exports = {
  siteMetadata: {
    title: `Daniela Matos de Carvalho`,
    description: `Daniela Matos de Carvalho personal website - blog and contacts`,
    author: `@sericaia`,
    siteUrl: `https://www.sericaia.me`,
    links: {
      email: "danielabmcarvalho@gmail.com",
      github: "https://github.com/sericaia",
      linkedin: "https://www.linkedin.com/in/danielabmcarvalho",
      twitter: "https://twitter.com/sericaia",
    },
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
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /images\/.*\.svg/,
        }
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/shortcake.png`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [".md", ".mdx"],
        defaultLayouts: {
          blog: require.resolve("./src/components/layout.js"),
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
