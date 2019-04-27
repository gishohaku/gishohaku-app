module.exports = {
  env: {
    WP_HOST: process.env.WP_HOST
  },
  target: 'serverless',
  distDir: '../dist/functions/next'
}
