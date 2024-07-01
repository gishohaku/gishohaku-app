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
    'あなたが最も得意とする技術、最も世界中に広めたい技術を、『技術書』という形で共有しませんか？ 技書博は、ITエンジニアが知見を共有するために開催される、技術書（技術同人誌）オンリーの同人誌即売会イベントです。',
  ]
    .filter((o) => o)
    .join(' | ')
  const jsonLdTags = {
    '@context': 'http://schema.org',
    '@type': 'Event',
    name: '第十一回技術書同人誌博覧会',
    alternateName: '技書博11',
    description:
      'あなたが最も得意とする技術、最も世界中に広めたい技術を、『技術書』という形で共有しませんか？ 技書博は、ITエンジニアが知見を共有するために開催される、技術書（技術同人誌）オンリーの同人誌即売会イベントです。',
    startDate: '2025-01-25',
    endDate: '2025-01-25',
    image: 'https://gishohaku.dev/static/gishohaku11-ogp.png',
    url: 'https://gishohaku.dev/',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    offers: {
      '@type': 'Offer',
      availability: 'InStock',
      validFrom: '2024-12-01T12:00',
      description:
        '来場者は無料で入場いただけるほか、有料懇親会も用意しています。',
      price: '0',
      priceCurrency: 'JPY',
      url: 'https://gishohaku.connpass.com/',
    },
    organizer: {
      '@type': 'Organization',
      name: '技術書同人誌博覧会',
      alternateName: '技書博',
      email: 'info@gishohaku.dev',
      url: 'https://gishohaku.dev/',
    },
    performer: {
      '@type': 'Organization',
      name: '技術書同人誌博覧会',
      alternateName: '技書博',
      email: 'info@gishohaku.dev',
      url: 'https://gishohaku.dev/',
    },
    location: {
      '@type': 'Place',
      name: '横浜産貿ホール マリネリア',
      address: {
        '@type': 'PostalAddress',
        addressLocality: '神奈川県横浜市中区',
        addressRegion: 'JP',
        postalCode: '230-0023',
        streetAddress: '神奈川県横浜市中区山下町2',
      },
    },
  }

  return (
    <Head>
      <title>{metaTitle}</title>
      <link
        rel="icon shortcut"
        sizes="256x256"
        href={'https://gishohaku.dev/static/gishohaku11-icon.png'}
        type="image/png"
      />
      <link
        rel="apple-touch-icon"
        sizes="256x256"
        href={'https://gishohaku.dev/static/gishohaku11-icon.png'}
        type="image/png"
      />
      <meta
        property="favicon"
        content={'https://gishohaku.dev/static/gishohaku11-icon.png'}
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
        content={imageUrl || 'https://gishohaku.dev/static/gishohaku11-ogp.png'}
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
        content={imageUrl || 'https://gishohaku.dev/static/gishohaku11-ogp.png'}
        key="twitter:image"
      />
      <meta name="description" content={metaDescription} key="description" />
      <meta
        name="keywords"
        content="技術同人誌,技術同人,技術書,技書博,技術書同人誌博覧会,同人誌即売会,同人誌,即売会"
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
