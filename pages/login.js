import React from 'react';
import Router from 'next/router';
import Link from 'next/link'
import cookie from 'js-cookie';
import { Section } from 'rbx';
import GoogleLogin from 'react-google-login';
import { fetchWithAuth } from './utils/auth';

class LoginButton extends React.Component {
  constructor(props) {
    super(props);

    this.checkLogin = this.checkLogin.bind(this);
  }

  async checkLogin({tokenId}) {
    cookie.set('token', tokenId, {expires: 2});

    // Check login
    try {
      const user = await fetchWithAuth('/api/login', {method: 'post', redirectOnError: false});

      // Save user locally
      cookie.set(user, JSON.stringify(user));

      // Callback
      this.props.onLogin()
    } catch(_) {
      // TODO: better UX
      alert('bad login');
      cookie.remove('token');
    }
  }

  render() {
    return (
      <Section>
        <GoogleLogin
        clientId="377683111950-606bk3n3bvma1f8f26d24tce5a6d3925.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={this.checkLogin}
        cookiePolicy={'single_host_origin'}
        />
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
    return {redirect: (ctx.query.redirect ? ctx.query.redirect : '/') }
  }

  onLogin() {
    Router.push(this.props.redirect)
  }

  render() {
    if (!cookie.get('token')) {
      return (
        <LoginButton onLogin={this.onLogin}/>
      )
    }

    return (
      <div>
        You're already logged in.  Want to <Link href="/logout">logout</Link>?
      </div>
    )
  }
}

export default Login;
