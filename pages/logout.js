import React from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';

class Logout extends React.Component {
  componentDidMount() {
    cookie.remove('token');
    cookie.remove('user');
    Router.push('/login');
  }

  render() {
    return (<div />);
  }
}

export default Logout;
