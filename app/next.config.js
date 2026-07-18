const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // このディレクトリ(app/)を出力トレースのルートにする
  // (リポジトリルートと app/ に lockfile が両方あるための警告を回避)
  outputFileTracingRoot: __dirname,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Emotion を SWC で変換する(jsxImportSource=@emotion/react の css prop に対応)
  compiler: {
    emotion: true,
  },
  env: {
    API_KEY: process.env.API_KEY,
    PROJECT_ID: process.env.PROJECT_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
  // next-images の代替: 画像 import を URL 文字列として解決する
  // (Next 標準の静的画像 import(StaticImageData オブジェクト)を無効化し、
  //  自前の asset/resource ルールで従来どおり文字列を返す)
  images: {
    disableStaticImages: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp|avif|ico)$/i,
      type: 'asset/resource',
    })
    return config
  },
}

module.exports = withMDX(nextConfig)
