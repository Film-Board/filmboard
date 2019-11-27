import {User} from '../../models';
import {getToken, isGoogleJWTValid, sign} from './util/auth';

export default async (req, res) => {
  const {method} = req;

  if (method === 'POST') {
    // Verify Google JWT
    const token = getToken(req);

    let decodedToken;

    try {
      decodedToken = await isGoogleJWTValid(token);
    } catch (_) {
      return res.status(401).json({error: 'Bad JWT.'});
    }

    // Make sure user exists in database
    const user = await User.findOne({where: {email: decodedToken.email}});

    if (user === null) {
      return res.status(401).json({error: 'User is not authorized.'});
    }

    user.picture = decodedToken.picture;

    // Issue new JWT
    const newToken = sign({user});

    return res.json({token: newToken});
  }
};
