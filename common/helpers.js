const getBaseURL = req => {
  return req ? `${req.secure ? 'https' : 'http'}://${req.headers.host}` : '';
};

module.exports = { getBaseURL };
