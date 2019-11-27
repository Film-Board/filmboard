import React from 'react';
import App from 'next/app';
import {Container} from 'rbx';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import Navbar from '../components/navbar';
import {parseToken} from '../components/lib/jwt';
import {getBaseURL} from '../common/helpers';
import '../styles/main.scss';

export default class MyApp extends App {
  constructor(props) {
    super(props);

    this.state = {
      loggedInUser: parseToken()
    };

    this.onLoginChange = this.onLoginChange.bind(this);
  }

  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);

    const pages = await (await fetch(`${getBaseURL(appContext.ctx)}/api/pages/navbar`)).json();

    return {...appProps, pages};
  }

  onLoginChange() {
    this.setState({loggedInUser: parseToken()});
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
          <Navbar pages={this.props.pages.pages} folders={this.props.pages.folders} loggedInUser={this.state.loggedInUser ? this.state.loggedInUser.user : undefined}/>
        </Container>

        <Component {...pageProps} onLoginChange={this.onLoginChange}/>
      </div>
    );
  }
}
