import React from "react"

import Link from 'next/link'
import SEO from "../SEO"

import Hero from "./hero"
import Sections from "./sections"
// import Share from "./share"

const Top = () => (
  <>
    <SEO keywords={[`同人誌即売会`, `技術同人誌`, `技書博`]} />
    {/* <Share /> */}
    <Hero />
    <Sections />
  </>
)

export default Top
