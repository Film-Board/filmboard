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
  })
}

const protect = (req, res, options = {}) => {
  const token = req.headers.authorization;

  return new Promise((resolve, reject) => {
    jwt.verify(token, getJWK, {}, (error, decoded) => {
      try {
      if (error) {
        return res.status(401).json({error: error.message});
      }

      // Verify user is in database
      User.findOne({where: {email: decoded.email}}).then(user => {
        if (user === null) {
          return res.status(401).json({error: 'email does not exist'});
        }

        if (options.permissions) {
          options.permissions.forEach(permission => {
            if (user[permission] === null || !user[permission]) {
              return res.status(401).json({error: 'unauthorized'});
            }
          })
        }

        resolve(user);
      })
    } catch (_) {
      return res.status(401).json({error: 'server error'});
    }
    });
  });
}

export {protect};
