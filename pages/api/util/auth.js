import jwt from 'jsonwebtoken';
import jwk from 'jwks-rsa';
import {SIGNING_SECRET} from '../../../config';

const getGoogleJWK = (header, callback) => {
  jwk({
    cache: true,
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
  }).getSigningKey(header.kid, (error, key) => {
    if (error) {
      callback(error);
    }

    const signingKey = key.publicKey || key.rsaPublicKey;

    callback(null, signingKey);
  });
};

const getToken = req => {
  if (req.headers.authorization) {
    return req.headers.authorization;
  }

  const cookies = req.headers.cookie.split(';').map(cookie => cookie.trim());

  let token = '';

  cookies.forEach(cookie => {
    if (cookie.indexOf('token') === 0) {
      token = cookie.split('=')[1];
    }
  });

  if (token === '') {
    throw new Error('No token found.');
  } else {
    return token;
  }
};

const protect = (req, res, options = {}) => {
  const {sendResponse = true} = options;
  const token = getToken(req);

  return new Promise((resolve, reject) => {
    jwt.verify(token, SIGNING_SECRET, {}, (error, decoded) => {
      if (error) {
        if (sendResponse) {
          return reject(res.status(401).json({error: error.message}));
        }

        return reject(error);
      }

      const {user} = decoded;

      if (options.permissions) {
        options.permissions.forEach(permission => {
          if (user[permission] === null || !user[permission]) {
            if (sendResponse) {
              return reject(res.status(401).json({error: 'Unauthorized.'}));
            }

            return reject(new Error('Unauthorized.'));
          }
        });
      }

      resolve();
    });
  });
};

const isGoogleJWTValid = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getGoogleJWK, {}, (error, decoded) => {
      if (error) {
        return reject(error);
      }

      return resolve(decoded);
    });
  });
};

const sign = data => {
  return jwt.sign(data, SIGNING_SECRET, {expiresIn: '24h'});
};

export {getToken, protect, isGoogleJWTValid, sign};
