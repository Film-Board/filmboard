import jwt from 'jsonwebtoken';
import jwk from 'jwks-rsa';
import {User} from '../../../models';

const getJWK = (header, callback) => {
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

const protect = (req, res, options = {sendResponse: true}) => {
  const {sendResponse} = options;
  const token = getToken(req);

  return new Promise((resolve, reject) => {
    jwt.verify(token, getJWK, {}, (error, decoded) => {
      try {
        if (error) {
          if (sendResponse) {
            return reject(res.status(401).json({error: error.message}));
          }

          return reject(error);
        }

        // Verify user is in database
        User.findOne({where: {email: decoded.email}}).then(user => {
          if (user === null) {
            if (sendResponse) {
              return reject(res.status(401).json({error: 'email does not exist'}));
            }

            return reject(new Error('email does not exist'));
          }

          if (options.permissions) {
            options.permissions.forEach(permission => {
              if (user[permission] === null || !user[permission]) {
                if (sendResponse) {
                  return reject(res.status(401).json({error: 'unauthorized'}));
                }

                return reject(new Error('unauthorized'));
              }
            });
          }

          resolve(user);
        });
      } catch (error2) {
        if (sendResponse) {
          return reject(res.status(401).json({error: 'server error'}));
        }

        return reject(error2);
      }
    });
  });
};

export {protect};
