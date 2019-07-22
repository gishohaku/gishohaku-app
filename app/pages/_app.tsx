import React, { ErrorInfo as _ErrorInfo } from 'react'
import App, { Container } from 'next/app'
import Router from 'next/router'
import 'firebase/auth'
import { UserProvider } from '../contexts/UserContext'
import { initFirebase } from '../utils/firebase'
import Layout from '../components/Layout'
import ReactGA from 'react-ga'
import * as Sentry from '@sentry/browser'

import '../lightbox.css'

const TRACKING_ID = 'UA-129667923-2'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN
  })
}

interface ErrorInfo extends _ErrorInfo {
  [key: string]: string
}

class MyApp extends App {
  componentDidMount() {
    initFirebase()
    ReactGA.initialize(TRACKING_ID, {
      debug: process.env.NODE_ENV !== 'production',
      testMode: process.env.NODE_ENV !== 'production'
    })
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.withScope((scope: any) => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key])
      })
      Sentry.captureException(error)
    })
    super.componentDidCatch(error, errorInfo)
  }

  public render() {
    const { Component, pageProps, router } = this.props as any
    return (
      <Container>
        <UserProvider>
          <Layout router={router}>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </Container>
    )
  }
}

Router.events.on('routeChangeComplete', (url: string) => ReactGA.pageview(url))

export default MyApp
