// kindly adapted from https://www.gatsbyjs.org/docs/mdx/programmatically-creating-pages/
const path = require('path')
const has = require('lodash/has')
const get = require('lodash/get')

const BLOG_FOLDER = '/content/blogposts/'

exports.onCreateNode = ({ node, actions }) => {
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

const createBlogposts = async (graphql, createPage, reporter) => {
  // get all blogposts and use specific layout and data (title, date)

  const allBlogposts = await graphql(`
    fragment meta on Mdx {
      fields {
        pathname
      }
      frontmatter {
        title
      }
    }
    query {
      allMdx(
        sort: { fields: frontmatter___date, order: ASC }
        filter: { fields: { type: { eq: "blogpost" } } }
      ) {
        edges {
          node {
            id
            fields {
              pathname
            }
          }
          next {
            ...meta
          }
          previous {
            ...meta
          }
        }
      }
    }
  `)

  if (allBlogposts.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }

  const posts = allBlogposts.data.allMdx.edges

  posts.forEach(({ node, next, previous }, index) => {
    createPage({
      path: node.fields.pathname,
      component: path.resolve(`./src/components/blogpost-layout.js`),
      context: {
        id: node.id,
        previous: {
          pathname: get(previous, 'fields.pathname'),
          title: get(previous, 'frontmatter.title'),
        },
        next: {
          pathname: get(next, 'fields.pathname'),
          title: get(next, 'frontmatter.title'),
        },
      },
    })
  })
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  await createBlogposts(graphql, createPage, reporter)
}
