import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import Router from 'next/router'
import 'firebase/auth'
import { UserProvider } from '../contexts/UserContext'
import { initFirebase } from '../utils/firebase'
import Layout from '../components/Layout'
import ReactGA from 'react-ga';

const TRACKING_ID = "UA-129667923-2"

class MyApp extends App {
  componentDidMount() {
    initFirebase()
    ReactGA.initialize(TRACKING_ID, {
      debug: true,
      testMode: true
    })
  }

  public render() {
    const { Component, pageProps, router } = this.props as any;
    return (
      <Container>
        <UserProvider>
          <Head>
            <title>Next Firebase App</title>
          </Head>
          <Layout router={router}>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </Container>
    );
  }
}

Router.events.on('routeChangeComplete', (url: string) => ReactGA.pageview(url))

export default MyApp
