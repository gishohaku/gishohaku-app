import React, { ErrorInfo as _ErrorInfo } from 'react'
import App from 'next/app'
import Router from 'next/router'
import { UserProvider } from '../contexts/UserContext'
import { EventProvider } from '../contexts/EventContext'
import '../utils/firebase'
import Layout from '../components/Layout'
import ReactGA from 'react-ga'
// import * as Sentry from '@sentry/browser'

import '../lightbox.css'
import { StarsProvider } from '../contexts/StarsContext'

const TRACKING_ID = 'UA-129667923-2'

// if (process.env.NODE_ENV === 'production') {
//   Sentry.init({
//     dsn: process.env.SENTRY_DSN
//   })
// }

// interface ErrorInfo extends _ErrorInfo {
//   [key: string]: string
// }

class MyApp extends App {
  componentDidMount() {
    ReactGA.initialize(TRACKING_ID, {
      debug: process.env.NODE_ENV !== 'production',
      testMode: process.env.NODE_ENV !== 'production'
    })
  }

  // componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  //   Sentry.withScope((scope: any) => {
  //     Object.keys(errorInfo).forEach(key => {
  //       scope.setExtra(key, errorInfo[key])
  //     })
  //     Sentry.captureException(error)
  //   })
  //   super.componentDidCatch(error, errorInfo)
  // }

  public render() {
    const { Component, pageProps, router } = this.props as any
    const eventId = router.query?.eventId || pageProps?.eventId
    return (
      <UserProvider>
        <EventProvider initialId={eventId}>
          <StarsProvider>
            <Layout router={router}>
              <Component {...pageProps} />
            </Layout>
          </StarsProvider>
        </EventProvider>
      </UserProvider>
    )
  }
}

Router.events.on('routeChangeComplete', (url: string) => ReactGA.pageview(url))

export default MyApp
