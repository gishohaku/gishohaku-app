import React from "react"

import Link from 'next/link'
import Layout from "../Layout"
import SEO from "../SEO"

import Hero from "./hero"
import Sections from "./sections"
// import Share from "./share"

const Top = () => (
  <Layout>
    <SEO keywords={[`同人誌即売会`, `技術同人誌`, `技書博`]} />
    {/* <Share /> */}
    <Link href='/mypage'>Mypage</Link>
    <Hero />
    <Sections />
  </Layout>
)

export default Top
