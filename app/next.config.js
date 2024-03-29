const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})
const withImages = require('next-images')

// compose使う
module.exports = withImages(
  withMDX({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    env: {
      API_KEY: process.env.API_KEY,
      PROJECT_ID: process.env.PROJECT_ID,
      SENTRY_DSN: process.env.SENTRY_DSN,
    },
    exportPathMap: (defaultPathMap) => {
      delete defaultPathMap['/[eventId]/books']
      delete defaultPathMap['/[eventId]/books/[id]']
      delete defaultPathMap['/[eventId]/circles']
      delete defaultPathMap['/[eventId]/circles/[id]']
      delete defaultPathMap['/[eventId]/mypage']
      delete defaultPathMap['/[eventId]/mypage/circle']
      delete defaultPathMap['/[eventId]/mypage/join']
      const pathMap = {
        ...defaultPathMap,
        '/gishohaku1/mypage': {
          page: '/[eventId]/mypage',
          query: { eventId: 'gishohaku1' },
        },
        '/gishohaku2/mypage': {
          page: '/[eventId]/mypage',
          query: { eventId: 'gishohaku2' },
        },
        '/gishohaku1/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku1' },
        },
        '/gishohaku2/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku2' },
        },
        '/gishohaku1/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku1' },
        },
        '/gishohaku2/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku2' },
        },
        '/gishohaku2/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku2' },
        },
        '/gishohaku1/mypage/book_stars': {
          page: '/[eventId]/mypage/book_stars',
          query: { eventId: 'gishohaku1' },
        },
        '/gishohaku2/mypage/book_stars': {
          page: '/[eventId]/mypage/book_stars',
          query: { eventId: 'gishohaku2' },
        },
      }

      return pathMap
    },
  }),
)
