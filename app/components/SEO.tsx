import React from 'react'
import Head from 'next/head'

interface Props {
  title?: string
  description?: string
  imageUrl?: string
}

const SEO: React.FC<Props> = ({ description, title, imageUrl }) => {
  const metaTitle = [title, '技術書同人誌博覧会'].filter(o => o).join(' | ')
  const metaDescription = [
    description,
    'あなたが最も得意とする技術、最も世界中に広めたい技術を、『技術書』という形で共有しませんか？ 技書博は、ITエンジニアが知見を共有するために開催される、技術書オンリーイベントです。'
  ]
    .filter(o => o)
    .join(' | ')

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl || 'https://gishohaku.dev/static/ogp.jpg'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@gishohaku" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content="同人誌即売会, 技術同人誌, 技書博" />
    </Head>
  )
}

export default SEO
