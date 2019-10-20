const getBaseURL = ctx => {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.browser ? window.location.host : ctx.req.headers.host;

  return `${protocol}://${host}`;
};

export { getBaseURL };
