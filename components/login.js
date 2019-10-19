import React from 'react';
import cookie from 'js-cookie';
import { Section } from 'rbx';
import GoogleLogin from 'react-google-login';

class Login extends React.Component {
  render() {
    const checkLogin = ({tokenId}) => {
      // TODO: check if email is allowed (in users database)
      cookie.set('token', tokenId, {expires: 2});
      this.props.onLogin();
    }

    return (
      <Section>
        <GoogleLogin
        clientId="377683111950-606bk3n3bvma1f8f26d24tce5a6d3925.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={checkLogin}
        cookiePolicy={'single_host_origin'}
        />
      </Section>
    );
  }
}

export default Login;
