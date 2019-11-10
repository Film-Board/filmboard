import React from 'react';
import App from 'next/app';
import {Container} from 'rbx';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import Navbar from '../components/navbar';
import {getBaseURL} from '../common/helpers';
import '../styles/main.scss';

export default class MyApp extends App {
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);

    const pages = await (await fetch(`${getBaseURL(appContext.ctx)}/api/pages`)).json();

    return {...appProps, pages};
  }

  render() {
    const {Component, pageProps} = this.props;

    return (
      <div>
        <Head>
          <title>Filmboard</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        </Head>
        <Container>
          <Navbar pages={this.props.pages}/>
        </Container>

        <Component {...pageProps}/>
      </div>
    );
  }
}
