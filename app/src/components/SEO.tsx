import React from 'react'
import Head from 'next/head'

interface Props {
  title?: string
  description?: string
  imageUrl?: string
}

const SEO: React.FC<Props> = ({ description, title, imageUrl }) => {
  const metaTitle = [title, '技術書同人誌博覧会'].filter((o) => o).join(' | ')
  const metaDescription = [
    description,
    'あなたが最も得意とする技術、最も世界中に広めたい技術を、『技術書』という形で共有しませんか？ 技書博は、ITエンジニアが知見を共有するために開催される、技術書オンリーイベントです。',
  ]
    .filter((o) => o)
    .join(' | ')
  const jsonLdTags = {
    '@context': 'http://schema.org',
    '@type': 'Event',
    name: '技術書同人誌博覧会',
    description:
      'あなたが最も得意とする技術、最も世界中に広めたい技術を、『技術書』という形で共有しませんか？ 技書博は、ITエンジニアが知見を共有するために開催される、技術書オンリーイベントです。',
    startDate: '2023-05-28',
    endDate: '2023-05-28',
    image: 'https://gishohaku.dev/static/gishohaku8-ogp.png',
    url: 'https://gishohaku.dev/',
    offers: {
      '@type': 'Offer',
      availability: 'InStock',
      validFrom: '2023-04-01T12:00',
      description:
        '来場者は会期中に無料（時間予約制）で入場いただけるほか、有料懇親会も用意しています。',
      price: '0',
      priceCurrency: 'JPY',
      url: 'https://gishohaku.dev/',
    },
    performer: {
      '@type': 'PerformingGroup',
      name: '技術書同人誌博覧会 運営事務局',
    },
    location: {
      '@type': 'Place',
      name: '吹上ホール 第二ファッション展示場',
      address: {
        '@type': 'PostalAddress',
        addressLocality: '愛知県名古屋市',
        addressRegion: 'JP',
        postalCode: '464-0856',
        streetAddress: '愛知県名古屋市千種区吹上2-6-3',
      },
    },
  }

  return (
    <Head>
      <title>{metaTitle}</title>
      <link
        rel="icon shortcut"
        sizes="256x256"
        href={'https://gishohaku.dev/static/gishohaku8-icon.png'}
        type="image/png"
      />
      <link
        rel="apple-touch-icon"
        sizes="256x256"
        href={'https://gishohaku.dev/static/gishohaku8-icon.png'}
        type="image/png"
      />
      <meta
        property="favicon"
        content={'https://gishohaku.dev/static/gishohaku8-icon.png'}
        key="image"
      />
      <meta
        property="og:description"
        content={metaDescription}
        key="description"
      />
      <meta property="og:type" content="website" key="type" />
      <meta
        property="og:site_name"
        content="技術書同人誌博覧会"
        key="site_name"
      />
      <meta
        property="og:image"
        content={imageUrl || 'https://gishohaku.dev/static/gishohaku8-ogp.png'}
        key="image"
      />
      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitter:card"
      />
      <meta name="twitter:creator" content="@gishohaku" key="twitter:creater" />
      <meta name="twitter:title" content={metaTitle} key="twitter:title" />
      <meta
        name="twitter:description"
        content={metaDescription}
        key="twitter:description"
      />
      <meta
        property="twitter:image"
        content={imageUrl || 'https://gishohaku.dev/static/gishohaku8-ogp.png'}
        key="twitter:image"
      />
      <meta name="description" content={metaDescription} key="description" />
      <meta
        name="keywords"
        content="同人誌即売会, 技術同人誌, 技書博"
        key="keywords"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTags) }}
      />
    </Head>
  )
}

export default SEO
