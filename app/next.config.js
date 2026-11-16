// @next/mdx + remark-gfm を有効化。
// Turbopack 要件のため remark プラグインは **文字列名で指定** する
// (関数参照は Rust 側にシリアライズできずビルド失敗になるため)。
// 主目的: gishohaku1/terms.mdx などの表マークダウンを正しく描画する (Issue #309)
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-gfm'],
  },
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
  // 画像 import は Next 標準の静的 import (StaticImageData オブジェクト) を利用する。
  // Next 16 + Turbopack では `images.disableStaticImages` も webpack の
  // `asset/resource` カスタムルールも効かないため、各 <img src={X}> 使用箇所を
  // `<img src={X.src}>` へ移行済み。next.config.js 側の特殊設定は不要。
}

module.exports = withMDX(nextConfig)
