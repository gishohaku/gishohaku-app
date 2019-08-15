const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')

// compose使う
module.exports = withImages(
  withCSS(
    withMDX({
      pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
      env: {
        API_KEY: process.env.API_KEY,
        AUTH_DOMAIN: process.env.AUTH_DOMAIN,
        DATABASE_URL: process.env.DATABASE_URL,
        PROJECT_ID: process.env.PROJECT_ID,
        STORAGE_BUCKET: process.env.STORAGE_BUCKET,
        SENTRY_DSN: process.env.SENTRY_DSN
      },
      distDir: '../dist/functions/next',
      outDir: '../dist/public',
      exportPathMap: defaultPathMap => {
        delete defaultPathMap['/circles/[id]']
        console.log(defaultPathMap)
        return defaultPathMap
      }
    })
  )
)
