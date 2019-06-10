import React from 'react'
import App, { Container } from 'next/app'
import Router from 'next/router'
import 'firebase/auth'
import { UserProvider } from '../contexts/UserContext'
import { initFirebase } from '../utils/firebase'
import SEO from '../components/SEO'
import ReactGA from 'react-ga'

const TRACKING_ID = 'UA-129667923-2'

class MyApp extends App {
  componentDidMount() {
    initFirebase()
    ReactGA.initialize(TRACKING_ID, {
      debug: process.env.NODE_ENV !== 'production',
      testMode: process.env.NODE_ENV !== 'production'
    })
  }

  public render() {
    const { Component, pageProps, router } = this.props as any
    return (
      <Container>
        <SEO />
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </Container>
    )
  }
}

Router.events.on('routeChangeComplete', (url: string) => ReactGA.pageview(url))

export default MyApp
