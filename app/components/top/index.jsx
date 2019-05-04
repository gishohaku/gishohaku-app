import React from "react"

import Layout from "../layout"
import SEO from "../seo"

import Hero from "./hero"
import Sections from "./sections"
// import Share from "./share"

const Top = () => (
  <Layout hideHeader>
    <SEO keywords={[`同人誌即売会`, `技術同人誌`, `技書博`]} />
    {/* <Share /> */}
    <Hero />
    <Sections />
  </Layout>
)

export default Top
