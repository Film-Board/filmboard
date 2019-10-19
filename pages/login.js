import React from 'react';
import Router from 'next/router';
import Link from 'next/link'
import cookie from 'js-cookie';
import LoginButton from '../components/login';

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
