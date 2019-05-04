/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import Helmet from "react-helmet"

function SEO({ description, meta, keywords, title }) {
  const metaTitle = title
  const metaDescription = description

  return (
    <Helmet
      htmlAttributes={{
        lang: 'ja',
      }}
      title={metaTitle}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: metaTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        // TODO:
        {
          property: "og:image",
          content: '',
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        // TODO
        {
          name: `twitter:creator`,
          content: '',
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
              name: `keywords`,
              content: keywords.join(`, `),
            }
            : []
        )
        .concat(meta)}
    />
  )
}

SEO.defaultProps = {
  meta: [],
  keywords: [],
}

export default SEO
