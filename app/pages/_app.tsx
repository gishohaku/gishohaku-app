import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import firebase from 'firebase/app'
import 'firebase/auth'
import UserContext from '../contexts/UserContext'

class MyApp extends App {
  state = {
    currentUser: null
  }

  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        databaseURL: process.env.DATABASE_URL
      })
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('Logined', user)
        this.setState({
          currentUser: user
        })
      } else {
        console.log('Not Login')
        this.setState({
          currentUser: null
        })
      }
    })
  }

  public render() {
    const currentUser = this.state.currentUser
    const { Component, pageProps } = this.props as any;
    return (
      <Container>
        <UserContext.Provider value={currentUser}>
          <Head>
            <title>Next Firebase App</title>
          </Head>
          <Component {...pageProps} />
        </UserContext.Provider>
      </Container>
    );
  }
}

export default MyApp;
