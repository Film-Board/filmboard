import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import cookie from 'js-cookie';
import {Section, Column, Title} from 'rbx';
import GoogleLogin from 'react-google-login';
import fetch from 'isomorphic-unfetch';
import {GOOGLE_CLIENT_ID} from '../config';

class LoginButton extends React.Component {
  constructor(props) {
    super(props);

    this.checkLogin = this.checkLogin.bind(this);
    this.failedLogin = this.failedLogin.bind(this);

    this.state = {
      errorMessage: ''
    };
  }

  async checkLogin({tokenId}) {
    cookie.set('token', tokenId, {expires: 1});

    // Check login & get issued JWT
    try {
      const res = await (await fetch('/api/login', {method: 'post', redirectOnError: false, headers: {
        Authorization: tokenId
      }})).json();

      if (res.error) {
        throw new Error(res.error);
      }

      cookie.set('token', res.token, {expires: 1});

      // Callback
      this.props.onLogin();
    } catch (error) {
      this.setState({errorMessage: error.message});
      cookie.remove('token');
    }
  }

  failedLogin(error) {
    console.error(error);
  }

  render() {
    return (
      <Section>
        <Column.Group>
          <Column className="has-text-centered">
            {this.state.errorMessage === '' ? (
              <div/>
            ) : (
              <Title size={3}>{this.state.errorMessage}</Title>
            )}
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              cookiePolicy="single_host_origin"
              onSuccess={this.checkLogin}
              onFailure={this.failedLogin}
            />
          </Column>
        </Column.Group>
      </Section>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.onLogin = this.onLogin.bind(this);
  }

  static async getInitialProps(ctx) {
    return {redirect: (ctx.query.redirect ? ctx.query.redirect : '/')};
  }

  onLogin() {
    this.props.onLoginChange();

    Router.push(this.props.redirect);
  }

  render() {
    if (!cookie.get('token')) {
      return (
        <LoginButton onLogin={this.onLogin}/>
      );
    }

    return (
      <Section>
        <Column.Group centered>
          <Column className="has-text-centered">
            <Title size={3}>You&apos;re already logged in.</Title>
            <Title size={5}>Want to <Link href="/logout"><a>logout</a></Link>?</Title>
          </Column>
        </Column.Group>
      </Section>
    );
  }
}

export default Login;
