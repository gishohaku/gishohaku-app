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
        '/gishohaku3/mypage': {
          page: '/[eventId]/mypage',
          query: { eventId: 'gishohaku3' },
        },
        '/gishohaku4/mypage': {
          page: '/[eventId]/mypage',
          query: { eventId: 'gishohaku4' },
        },
        '/gishohaku5/mypage': {
          page: '/[eventId]/mypage',
          query: { eventId: 'gishohaku5' },
        },
        '/gishohaku6/mypage': {
          page: '/[eventId]/mypage',
          query: { eventId: 'gishohaku6' },
        },
        '/gishohaku7/mypage': {
          page: '/[eventId]/mypage',
          query: { eventId: 'gishohaku7' },
        },
        '/gishohaku8/mypage': {
          page: '/[eventId]/mypage',
          query: { eventId: 'gishohaku8' },
        },
        '/gishohaku9/mypage': {
          page: '/[eventId]/mypage',
          query: { eventId: 'gishohaku9' },
        },
        '/gishohaku10/mypage': {
          page: '/[eventId]/mypage',
          query: { eventId: 'gishohaku10' },
        },
        '/gishohaku1/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku1' },
        },
        '/gishohaku2/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku2' },
        },
        '/gishohaku3/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku3' },
        },
        '/gishohaku4/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku4' },
        },
        '/gishohaku5/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku5' },
        },
        '/gishohaku6/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku6' },
        },
        '/gishohaku7/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku7' },
        },
        '/gishohaku8/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku8' },
        },
        '/gishohaku9/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku9' },
        },
        '/gishohaku10/mypage/circle': {
          page: '/[eventId]/mypage/circle',
          query: { eventId: 'gishohaku10' },
        },
        '/gishohaku1/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku1' },
        },
        '/gishohaku2/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku2' },
        },
        '/gishohaku3/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku3' },
        },
        '/gishohaku4/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku4' },
        },
        '/gishohaku5/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku5' },
        },
        '/gishohaku6/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku6' },
        },
        '/gishohaku7/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku7' },
        },
        '/gishohaku8/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku8' },
        },
        '/gishohaku9/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku9' },
        },
        '/gishohaku10/mypage/join': {
          page: '/[eventId]/mypage/join',
          query: { eventId: 'gishohaku10' },
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
        '/gishohaku3/mypage/book_stars': {
          page: '/[eventId]/mypage/book_stars',
          query: { eventId: 'gishohaku3' },
        },
        '/gishohaku4/mypage/book_stars': {
          page: '/[eventId]/mypage/book_stars',
          query: { eventId: 'gishohaku4' },
        },
        '/gishohaku5/mypage/book_stars': {
          page: '/[eventId]/mypage/book_stars',
          query: { eventId: 'gishohaku5' },
        },
        '/gishohaku6/mypage/book_stars': {
          page: '/[eventId]/mypage/book_stars',
          query: { eventId: 'gishohaku6' },
        },
        '/gishohaku7/mypage/book_stars': {
          page: '/[eventId]/mypage/book_stars',
          query: { eventId: 'gishohaku7' },
        },
        '/gishohaku8/mypage/book_stars': {
          page: '/[eventId]/mypage/book_stars',
          query: { eventId: 'gishohaku8' },
        },
        '/gishohaku9/mypage/book_stars': {
          page: '/[eventId]/mypage/book_stars',
          query: { eventId: 'gishohaku9' },
        },
        '/gishohaku0/mypage/book_stars': {
          page: '/[eventId]/mypage/book_stars',
          query: { eventId: 'gishohaku10' },
        },
      }

      return pathMap
    },
  }),
)
