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
      <meta property="og:description" content={metaDescription} key="description" />
      <meta property="og:type" content="website" key="type" />
      <meta property="og:image" content={imageUrl || 'https://gishohaku.dev/static/ogp.jpg'} key="image" />
      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:creator" content="@gishohaku" key="twitter:creater" />
      <meta name="twitter:title" content={metaTitle} key="twitter:title" />
      <meta name="twitter:description" content={metaDescription} key="twitter:description" />
      <meta name="description" content={metaDescription} key="description" />
      <meta name="keywords" content="同人誌即売会, 技術同人誌, 技書博" key="keywords" />
    </Head>
  )
}

export default SEO
