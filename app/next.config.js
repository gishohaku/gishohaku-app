const withTypescript = require('@zeit/next-typescript')

module.exports = withTypescript({
  env: {
    WP_HOST: process.env.WP_HOST,
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID
  },
  exportPathMap: async function(defaultPathMap) {
    return defaultPathMap
  },
  // target: 'serverless',
  // distDir: '../dist/functions/next'
  // distDir: '../dist/functions/next'
})