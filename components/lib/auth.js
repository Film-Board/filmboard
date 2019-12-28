import Router from 'next/router';
import React from 'react';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import browserCookies from 'js-cookie';
import {getBaseURL} from '../../common/helpers';

const redirectOnError = ctx => {
  if (process.browser) {
    Router.push(`/login?redirect=${Router.asPath}`);
  } else {
    ctx.res.writeHead(301, {Location: `/login?redirect=${ctx.req.url}`});
    ctx.res.end();
  }
};

export const auth = ctx => {
  const {token} = nextCookie(ctx);

  if (!token) {
    return redirectOnError(ctx);
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
  let token;

  if (ctx) {
    ({token} = nextCookie(ctx));
  } else {
    token = browserCookies.get('token');
  }

  const headers = {
    Authorization: token
  };

  if (typeof options.body === 'object' && !options.rawBody) {
    headers['Content-Type'] = 'application/json';

    // Trim strings
    Object.keys(options.body).forEach(key => {
      const value = options.body[key];

      if (typeof value === 'string') {
        options.body[key] = value.trim();
      }
    });
    options.body = JSON.stringify(options.body);
  }

  const mergedOptions = {...options, headers};

  try {
    const res = await fetch(`${ctx ? getBaseURL(ctx) : ''}${url}`, mergedOptions);

    if (res.ok) {
      return res.json();
    }

    if (options.redirectOnError) {
      return redirectOnError();
    }

    // Attempt to parse response
    let j = {};
    try {
      j = await res.json();
    } catch (_) {}

    throw new Error(Object.keys(j) === 0 ? 'Bad response.' : j.error);
  } catch (error) {
    if (options.redirectOnError) {
      return redirectOnError();
    }

    throw error;
  }
};

export const optimisticAuthFetch = async (url, options, ctx) => {
  const {token} = nextCookie(ctx);
  const headers = {};

  if (token) {
    headers.Authorization = token;
  }

  if (typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const mergedOptions = {...options, headers};

  const res = await fetch(`${ctx ? getBaseURL(ctx) : ''}${url}`, mergedOptions);

  if (res.ok) {
    return res.json();
  }
};
