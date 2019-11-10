import Router from 'next/router';
import React from 'react';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import {getBaseURL} from '../../common/helpers';

export const auth = ctx => {
  const {token} = nextCookie(ctx);

  if (ctx.req && !token) {
    ctx.res.writeHead(302, {Location: '/login'});
    ctx.res.end();
    return;
  }

  if (!token) {
    Router.push('/login');
  }

  return token;
};

const getDisplayName = Component =>
  Component.displayName || Component.name || 'Component';

export const withAuthSync = WrappedComponent => {
  return class extends React.Component {
    static get displayName() {
      return `withAuthSync(${getDisplayName(WrappedComponent)})`;
    }

    static async getInitialProps(ctx) {
      const token = auth(ctx);

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      return {...componentProps, token};
    }

    render() {
      return <WrappedComponent {...this.props}/>;
    }
  };
};

export const fetchWithAuth = async (url, options, ctx) => {
  const {token} = nextCookie(ctx);

  const headers = {
    Authorization: token
  };

  if (typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const mergedOptions = {...options, headers};

  const redirectOnError = () => {
    if (options.redirectOnError === false) {
      throw new Error('Unauthorized.');
    }

    if (process.browser) {
      Router.push('/login');
    } else {
      ctx.res.writeHead(301, {Location: '/login'});
    }
  };

  try {
    const res = await fetch(`${ctx ? getBaseURL(ctx) : ''}${url}`, mergedOptions);

    if (res.ok) {
      return res.json();
    }

    return redirectOnError();
  } catch (_) {
    return redirectOnError();
  }
};
