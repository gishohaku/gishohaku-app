import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import 'firebase/auth'
import { UserProvider } from '../contexts/UserContext'
import { initFirebase } from '../utils/firebase'
import Layout from '../components/Layout'

class MyApp extends App {
  componentDidMount() {
    initFirebase()
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

export default MyApp;
