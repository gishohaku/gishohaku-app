import React, { ErrorInfo as _ErrorInfo } from 'react'
import App, { AppContext } from 'next/app'
import Router from 'next/router'
import { UserProvider } from '../contexts/UserContext'
import { EventProvider } from '../contexts/EventContext'
import '../utils/firebase'
import Layout from '../components/Layout'
import ReactGA from 'react-ga'
import 'tailwindcss/tailwind.css'

// import * as Sentry from '@sentry/browser'

import '../lightbox.css'
import { StarsProvider } from '../contexts/StarsContext'
import { ToastProvider } from '../components/Toast'

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
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      pageProps,
      // query from next config pathmap
      eventId: ctx.query.eventId || 'gishohaku3',
    }
  }

  componentDidMount() {
    ReactGA.initialize(TRACKING_ID, {
      debug: process.env.NODE_ENV !== 'production',
      testMode: process.env.NODE_ENV !== 'production',
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
    const { Component, pageProps, router, eventId } = this.props as any
    return (
      <UserProvider>
        <EventProvider initialId={eventId}>
          <StarsProvider>
            <ToastProvider>
              <Layout router={router}>
                <Component {...pageProps} />
              </Layout>
            </ToastProvider>
          </StarsProvider>
        </EventProvider>
      </UserProvider>
    )
  }
}

Router.events.on('routeChangeComplete', (url: string) => ReactGA.pageview(url))

export default MyApp
