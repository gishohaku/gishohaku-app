import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import firebase from 'firebase/app'
import 'firebase/auth'
import UserContext from '../contexts/UserContext'
import { initFirebase } from '../utils/firebase'

class MyApp extends App {
  state = {
    currentUser: null
  }

  componentDidMount() {
    initFirebase()

    firebase.auth().onAuthStateChanged((currentUser) => {
      this.setState({ currentUser })
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
