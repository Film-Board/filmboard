const getBaseURL = req => {
  return req ? `${req.protocol}://${req.get('Host')}` : '';
}

module.exports = {getBaseURL};
