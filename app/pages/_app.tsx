import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import firebase from 'firebase/app'

class MyApp extends App {
  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: 'next-serverless-app', //process.env.PROJECT_ID,
        databaseURL: 'https://next-serverless-app.firebaseio.com/'
      })
    }
  }

  public render() {
    const { Component, pageProps } = this.props as any;
    return (
      <Container>
        <Head>
          <title>Next Firebase App</title>
        </Head>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;
