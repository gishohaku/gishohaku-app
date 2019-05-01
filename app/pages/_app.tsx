import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import firebase from 'firebase/app'
import 'firebase/auth'

class MyApp extends App {

  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        databaseURL: process.env.DATABASE_URL
      })
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('Logined', user)
      } else {
        console.log('Not Login')
      }
    });
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
