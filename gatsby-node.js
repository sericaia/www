// kindly adapted from https://www.gatsbyjs.org/docs/mdx/programmatically-creating-pages/
const path = require('path')
const has = require('lodash/has')

const BLOG_FOLDER = '/content/blogposts/'

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // only for mdx files, which are blogposts in the BLOG_FOLDER and have a date
  if (
    node.internal.type === 'Mdx' &&
    node.fileAbsolutePath.includes(BLOG_FOLDER) &&
    has(node, 'frontmatter.date')
  ) {
    createNodeField({
      name: 'pathname',
      node,
      value: `/blog/${node.frontmatter.date}/${node.id}`,
    })

    createNodeField({
      name: 'type',
      node,
      value: 'blogpost',
    })
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // get all blogposts and use specific layout and data (title, date)
  const result = await graphql(`
    query {
      allMdx(filter: { fields: { type: { eq: "blogpost" } } }) {
        edges {
          node {
            id
            fields {
              pathname
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }

  const posts = result.data.allMdx.edges

  posts.forEach(({ node }, index) => {
    createPage({
      path: node.fields.pathname,
      component: path.resolve(`./src/components/blogpost-layout.js`),
      context: {
        id: node.id,
      },
    })
  })
}
