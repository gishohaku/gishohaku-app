const withTypescript = require('@zeit/next-typescript')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')

// compose使う
module.exports = withImages(withCSS(withMDX(withTypescript({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  env: {
    WP_HOST: process.env.WP_HOST,
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID
  },
  // target: 'serverless',
  distDir: '../dist/functions/next'
}))))